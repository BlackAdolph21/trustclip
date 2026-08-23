"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  CameraOff,
  Loader2,
  RefreshCw,
  RotateCcw,
  Send,
  Square,
  TriangleAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CameraStatus = "requesting" | "ready" | "denied" | "error" | "unsupported";
type RecordingPhase = "idle" | "recording" | "review" | "submitted";

type CaptureSignal = { cancelled: boolean };

type RecorderClientProps = {
  businessId: string;
  businessName: string;
};

const RECORDING_LIMIT_SECONDS = 60;

const MIME_TYPE_CANDIDATES = [
  "video/webm;codecs=vp9,opus",
  "video/webm;codecs=vp8,opus",
  "video/webm",
  "video/mp4",
];

function getSupportedMimeType() {
  if (typeof MediaRecorder === "undefined") return undefined;
  return MIME_TYPE_CANDIDATES.find((type) => MediaRecorder.isTypeSupported?.(type));
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function RecorderClient({ businessId, businessName }: RecorderClientProps) {
  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordedBlobRef = useRef<Blob | null>(null);

  const [cameraStatus, setCameraStatus] = useState<CameraStatus>("requesting");
  const [cameraErrorMessage, setCameraErrorMessage] = useState<string | null>(null);

  const [phase, setPhase] = useState<RecordingPhase>("idle");
  const [timeLeft, setTimeLeft] = useState(RECORDING_LIMIT_SECONDS);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [reviewerBusinessName, setReviewerBusinessName] = useState("");

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const captureCamera = useCallback(async (signal: CaptureSignal) => {
    if (signal.cancelled) return;

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraStatus("unsupported");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });

      if (signal.cancelled) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
      }
      setCameraErrorMessage(null);
      setCameraStatus("ready");
    } catch (error) {
      if (signal.cancelled) return;

      const name = error instanceof DOMException ? error.name : "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setCameraStatus("denied");
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        setCameraErrorMessage("We couldn't find a camera or microphone on this device.");
        setCameraStatus("error");
      } else {
        setCameraErrorMessage("Something went wrong while starting your camera.");
        setCameraStatus("error");
      }
    }
  }, []);

  useEffect(() => {
    const signal: CaptureSignal = { cancelled: false };
    // Deferred via a microtask so the camera request is kicked off as a
    // callback rather than a call synchronously inlined in the effect body.
    queueMicrotask(() => {
      captureCamera(signal);
    });
    return () => {
      signal.cancelled = true;
      clearTimer();
      stopStream();
    };
  }, [captureCamera, clearTimer, stopStream]);

  useEffect(() => {
    return () => {
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    };
  }, [recordedUrl]);

  const handleRetryCamera = useCallback(() => {
    setCameraStatus("requesting");
    setCameraErrorMessage(null);
    captureCamera({ cancelled: false });
  }, [captureCamera]);

  const stopRecording = useCallback(() => {
    clearTimer();
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
  }, [clearTimer]);

  const startRecording = useCallback(() => {
    if (!streamRef.current || typeof MediaRecorder === "undefined") return;

    chunksRef.current = [];
    const mimeType = getSupportedMimeType();
    const options: MediaRecorderOptions = {
      videoBitsPerSecond: 2500000,
      ...(mimeType ? { mimeType } : {}),
    };

    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(streamRef.current, options);
    } catch (error) {
      // Some browsers (notably Safari) can reject certain MediaRecorder
      // options, such as an unsupported bitrate/mimeType combination.
      // Fall back to letting the browser pick its own defaults.
      console.warn("MediaRecorder options were rejected, falling back:", error);
      recorder = new MediaRecorder(streamRef.current);
    }

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: recorder.mimeType || "video/webm",
      });
      recordedBlobRef.current = blob;
      setRecordedUrl(URL.createObjectURL(blob));
      setPhase("review");
    };

    mediaRecorderRef.current = recorder;
    recorder.start();

    setTimeLeft(RECORDING_LIMIT_SECONDS);
    setPhase("recording");

    timerRef.current = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          stopRecording();
          return 0;
        }
        return previous - 1;
      });
    }, 1000);
  }, [stopRecording]);

  const retakeVideo = useCallback(() => {
    setRecordedUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return null;
    });
    chunksRef.current = [];
    recordedBlobRef.current = null;
    setTimeLeft(RECORDING_LIMIT_SECONDS);
    setPhase("idle");

    // Some browsers (notably iOS Safari) silently pause a live video element
    // while it's hidden, so explicitly resume it once it's visible again.
    requestAnimationFrame(() => {
      const liveVideo = liveVideoRef.current;
      if (!liveVideo || !streamRef.current) return;
      if (liveVideo.srcObject !== streamRef.current) {
        liveVideo.srcObject = streamRef.current;
      }
      liveVideo.play().catch(() => {
        // Autoplay may be blocked until the next user gesture; safe to ignore.
      });
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    const blob = recordedBlobRef.current;
    if (!blob) return;

    if (!customerName.trim()) {
      alert("Please enter your name before submitting!");
      return;
    }

    setIsUploading(true);

    const trimmedBusinessName = reviewerBusinessName.trim();
    const finalName = trimmedBusinessName
      ? `${customerName.trim()} | ${trimmedBusinessName}`
      : customerName.trim();

    try {
      const presignResponse = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: blob.type,
          fileSize: blob.size,
          customerName: finalName,
          businessId,
        }),
      });
      if (!presignResponse.ok) {
        const { error: presignError } = await presignResponse
          .json()
          .catch(() => ({ error: null }));
        throw new Error(presignError || "Failed to get upload URL.");
      }
      const { uploadUrl } = await presignResponse.json();

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "video/mp4" },
        body: blob,
      });
      if (!uploadResponse.ok) {
        throw new Error("Failed to upload video.");
      }

      setPhase("submitted");
    } catch (error) {
      console.error("Failed to submit testimonial:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while uploading your testimonial. Please try again.";
      alert(message);
    } finally {
      setIsUploading(false);
    }
  }, [businessId, customerName, reviewerBusinessName]);

  const isCameraReady = cameraStatus === "ready";
  const showLiveFeed = isCameraReady && phase !== "review";

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-950 px-4 py-10 text-zinc-50 sm:py-16">
      <div className="flex items-center gap-2">
        <span className="text-3xl font-bold text-white tracking-tight">TrustClip</span>
      </div>

      <div className="mt-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {phase === "submitted" ? "Thank you!" : `Record a testimonial for ${businessName}`}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-balance text-zinc-400">
          {phase === "submitted"
            ? "Your testimonial has been submitted successfully. We really appreciate it."
            : phase === "review"
              ? "Watch it back, then retake or submit whenever you're happy."
              : "Find a well-lit spot, tap start, and share your story in your own words."}
        </p>
      </div>

      {phase === "submitted" ? (
        <div className="mx-auto mt-8 flex aspect-[9/16] w-full max-w-[380px] flex-col items-center justify-center gap-4 rounded-[2.5rem] border-8 border-zinc-800 bg-black shadow-2xl shadow-black/60">
          <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <Send className="size-7" />
          </div>
          <p className="text-lg font-semibold text-zinc-50">Thank You!</p>
        </div>
      ) : (
        <div className="relative mx-auto mt-8 aspect-[9/16] w-full max-w-[380px] overflow-hidden rounded-[2.5rem] border-8 border-zinc-800 bg-black shadow-2xl shadow-black/60">
          <div className="pointer-events-none absolute top-0 left-1/2 z-10 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-zinc-800" />

          <video
            ref={liveVideoRef}
            autoPlay
            playsInline
            muted
            className={`h-full w-full -scale-x-100 object-cover transition-opacity duration-300 ${
              phase === "review" ? "hidden" : showLiveFeed ? "opacity-100" : "opacity-0"
            }`}
          />

          {phase === "review" && recordedUrl && (
            <video
              src={recordedUrl}
              controls
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {isCameraReady && phase === "idle" && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur">
              <span className="size-1.5 animate-pulse rounded-full bg-red-500" />
              <span className="text-xs font-medium text-zinc-100">Live</span>
            </div>
          )}

          {phase === "recording" && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur">
              <span className="size-1.5 animate-pulse rounded-full bg-red-500" />
              <span className="text-xs font-medium tabular-nums text-zinc-100">
                {formatTime(timeLeft)}
              </span>
            </div>
          )}

          {cameraStatus === "requesting" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-950 px-6 text-center">
              <Loader2 className="size-8 animate-spin text-zinc-400" />
              <p className="text-sm text-zinc-400">Requesting camera access&hellip;</p>
            </div>
          )}

          {cameraStatus === "denied" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-950 px-6 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                <CameraOff className="size-6" />
              </div>
              <p className="text-sm font-medium text-zinc-100">
                Camera access is required to leave a testimonial.
              </p>
              <p className="text-xs text-zinc-500">
                Please enable camera &amp; microphone permissions for this site in your
                browser settings, then try again.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-1 border-white/15 bg-transparent text-zinc-100 hover:bg-white/5"
                onClick={handleRetryCamera}
              >
                <RefreshCw className="size-4" />
                Try Again
              </Button>
            </div>
          )}

          {cameraStatus === "unsupported" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-950 px-6 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                <TriangleAlert className="size-6" />
              </div>
              <p className="text-sm font-medium text-zinc-100">
                This browser doesn&apos;t support camera recording.
              </p>
              <p className="text-xs text-zinc-500">
                Try opening this link in a recent version of Safari or Chrome.
              </p>
            </div>
          )}

          {cameraStatus === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-950 px-6 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                <TriangleAlert className="size-6" />
              </div>
              <p className="text-sm font-medium text-zinc-100">
                {cameraErrorMessage ?? "Something went wrong while starting your camera."}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-1 border-white/15 bg-transparent text-zinc-100 hover:bg-white/5"
                onClick={handleRetryCamera}
              >
                <RefreshCw className="size-4" />
                Try Again
              </Button>
            </div>
          )}
        </div>
      )}

      {phase === "review" && (
        <div className="mt-4 flex w-full max-w-[380px] flex-col gap-3">
          <div>
            <Label htmlFor="customerName" className="text-zinc-300">
              What is your name?
            </Label>
            <Input
              id="customerName"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              className="mt-1.5 border-white/10 bg-white/5 text-zinc-50 placeholder:text-zinc-500 focus-visible:ring-violet-500/30"
            />
          </div>

          <div>
            <Label htmlFor="reviewerBusinessName" className="text-zinc-300">
              Where do you work? <span className="text-zinc-500">(Optional)</span>
            </Label>
            <Input
              id="reviewerBusinessName"
              type="text"
              autoComplete="organization"
              placeholder="Acme Co."
              value={reviewerBusinessName}
              onChange={(event) => setReviewerBusinessName(event.target.value)}
              className="mt-1.5 border-white/10 bg-white/5 text-zinc-50 placeholder:text-zinc-500 focus-visible:ring-violet-500/30"
            />
            <p className="mt-1.5 text-xs text-zinc-500">
              Adding your company helps make this testimonial even more credible.
            </p>
          </div>
        </div>
      )}

      {phase !== "submitted" && (
        <div
          className={`flex w-full max-w-[380px] flex-col gap-3 ${
            phase === "review" ? "mt-4" : "mt-8"
          }`}
        >
          {phase === "idle" && (
            <Button
              size="lg"
              disabled={!isCameraReady}
              className="w-full px-8 text-base"
              onClick={startRecording}
            >
              <span className="size-3 rounded-full bg-current" />
              Start Recording
            </Button>
          )}

          {phase === "recording" && (
            <Button
              size="lg"
              className="w-full border-transparent bg-red-600 px-8 text-base text-white hover:bg-red-500"
              onClick={stopRecording}
            >
              <Square className="size-4 fill-current" />
              Stop Recording
            </Button>
          )}

          {phase === "review" && (
            <div className="flex flex-col gap-3 pt-2">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-white/15 bg-transparent text-base text-zinc-100 hover:bg-white/5"
                onClick={retakeVideo}
                disabled={isUploading}
              >
                <RotateCcw className="size-4" />
                Retake Video
              </Button>
              <Button
                size="lg"
                className="w-full px-8 text-base"
                onClick={handleSubmit}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Uploading... (Please don&apos;t close this page)
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    Submit Testimonial
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {phase !== "review" && phase !== "submitted" && (
        <p className="mt-4 flex items-center gap-1.5 text-xs text-zinc-600">
          <Camera className="size-3.5" />
          Your video stays private until you choose to share it.
        </p>
      )}
    </div>
  );
}
