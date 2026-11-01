#!/usr/bin/env python3
"""Campfire bed for videos = the same sound as the site: woody knocks/pops only (tiny ringing resonators), NO noise bed.
The owner hated anything that sounds like wind or crinkly snack paper. usage: python3 fire.py out.wav [seconds]"""
import numpy as np, wave, math, sys
out=sys.argv[1]; secs=int(sys.argv[2]) if len(sys.argv)>2 else 60
sr=44100; n=sr*secs; rng=np.random.default_rng()
L=np.zeros(n); R=np.zeros(n)
def ev(t,f,tau,a,pan):
    i0=int(t*sr)
    if i0>=n: return
    m=min(n-i0,int(tau*sr*7),int(sr*.4)); r=math.exp(-1/(tau*sr)); c=2*r*math.cos(2*math.pi*f/sr); r2=r*r
    ex=max(3,int(sr*(.00015+rng.random()*.0005))); x=np.zeros(m); x[:ex]=rng.uniform(-1,1,min(ex,m)); y=np.zeros(m); y1=y2=0.0
    for i in range(m):
        v=c*y1-r2*y2+x[i]; y2=y1; y1=v; y[i]=v
    y=y/(np.abs(y).max()+1e-9)*a; fd=min(m,64); y[m-fd:]*=np.linspace(1,0,fd)
    L[i0:i0+m]+=y*(1-pan*.4); R[i0:i0+m]+=y*(1+pan*.4)
def one(t,small):
    r=rng.random(); pan=rng.uniform(-.7,.7)
    if small or r<.5: ev(t,600+rng.random()*1000,.004+rng.random()*.005,(.12 if small else .22)+rng.random()*.2,pan)
    elif r<.78: ev(t,1700+rng.random()*1400,.0015+rng.random()*.002,.15+rng.random()*.18,pan)
    elif r<.97: ev(t,230+rng.random()*300,.012+rng.random()*.014,.45+rng.random()*.3,pan)
    else: ev(t,75+rng.random()*45,.045+rng.random()*.02,.4,pan)
t=.05
while t<secs-.6:
    t+=rng.exponential(1/4.2); one(t,False)
    if rng.random()<.13:
        tt=t
        for k in range(5+rng.integers(0,9)):
            tt+=.02+rng.random()*.06; one(tt,True)
st=np.stack([L,R],1); st=st/np.abs(st).max()*.85
with wave.open(out,'wb') as f:
    f.setnchannels(2);f.setsampwidth(2);f.setframerate(sr);f.writeframes((st*32767).astype('<i2').tobytes())
print('wrote',out)
