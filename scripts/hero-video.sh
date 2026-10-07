#!/usr/bin/env bash
# Encodes the homepage hero background video from a source clip.
#
#   scripts/hero-video.sh <input.mp4> [start-seconds] [length-seconds] [mobile-crop-x]
#
# Writes public/hero/hero-desktop.mp4 (1280×720) and public/hero/hero-mobile.mp4
# (540×960 portrait crop for phones). mobile-crop-x places that crop across the
# frame: 0 = left edge, 0.5 = middle (default), 1 = right edge. Both files are
# silent H.264, fade in and out of black so the loop point is soft, and start
# playing before they finish downloading. Needs ffmpeg (`brew install ffmpeg`).
# Redeploy after running.
set -euo pipefail

input=${1:?usage: scripts/hero-video.sh <input.mp4> [start] [length] [mobile-crop-x]}
start=${2:-0}
length=${3:-10}
crop_x=${4:-0.5}
fade=0.5
out=public/hero
fade_out=$(echo "$length - $fade" | bc)
fades="fade=t=in:st=0:d=$fade,fade=t=out:st=$fade_out:d=$fade"
common=(-an -c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart -r 25)

mkdir -p "$out"

ffmpeg -loglevel error -y -ss "$start" -t "$length" -i "$input" \
  -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,$fades" \
  "${common[@]}" -crf 24 -maxrate 2.4M -bufsize 4.8M "$out/hero-desktop.mp4"

ffmpeg -loglevel error -y -ss "$start" -t "$length" -i "$input" \
  -vf "crop=ih*9/16:ih:(iw-ih*9/16)*$crop_x:0,scale=540:960,$fades" \
  "${common[@]}" -crf 26 -maxrate 1.1M -bufsize 2.2M "$out/hero-mobile.mp4"

ls -lh "$out"/hero-*.mp4
