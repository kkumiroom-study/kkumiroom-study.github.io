#!/bin/bash
# example mix for the 50 s TOEIC vlog: each narration line placed on the video timeline (see mix.filter),
# campfire bed, soft piano, bossa only around the cafe counter. usage: mix.sh narration.mp3 fire.wav dawn.wav bossa.wav out.wav
D=$(cd "$(dirname "$0")" && pwd)
ffmpeg -hide_banner -loglevel error -y -i "$1" -i "$2" -i "$3" -i "$4" -filter_complex_script "$D/mix.filter" -map "[out]" -ar 44100 "$5"
