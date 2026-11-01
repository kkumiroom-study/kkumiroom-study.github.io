#!/bin/bash
# example mix for the 44 s TOEIC vlog: narration starts at 1.0 s, campfire bed, soft piano, bossa only during the cafe scene (23.6-29 s)
# usage: mix.sh narration.mp3 fire.wav dawn.wav bossa.wav out.wav
ffmpeg -hide_banner -loglevel error -y -i "$1" -i "$2" -i "$3" -i "$4" -filter_complex "\
[0:a]aresample=44100,aformat=channel_layouts=stereo,adelay=1000|1000,apad=whole_dur=44[vo];\
[1:a]atrim=0:44,highpass=f=90,lowpass=f=5200,volume='if(between(t,23.6,28.7),0.3,if(between(t,28.7,34),1.0,0.7))':eval=frame,afade=t=out:st=42.3:d=1.7[fi];\
[2:a]atrim=4:48,asetpts=PTS-STARTPTS,volume='0.16*if(between(t,23.4,28.9),0.15,1)':eval=frame,afade=t=in:st=0:d=2,afade=t=out:st=41.5:d=2.5[pi];\
[3:a]atrim=0:5.4,asetpts=PTS-STARTPTS,volume=0.22,afade=t=in:st=0:d=0.4,afade=t=out:st=4.8:d=0.6,adelay=23650|23650[bo];\
[vo]asplit=2[vo1][vosc];[fi][pi][bo]amix=inputs=3:normalize=0[bed];[bed][vosc]sidechaincompress=threshold=0.05:ratio=4:attack=20:release=300[duck];\
[duck][vo1]amix=inputs=2:normalize=0,atrim=0:44,loudnorm=I=-15:TP=-1.5[out]" -map "[out]" -ar 44100 "$5"
