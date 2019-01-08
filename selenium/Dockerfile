# Heavily inspired by https://qxf2.com/blog/building-your-own-docker-images-for-different-browser-versions/

#Step 1
#Dockerfile to build an image for different versions of firefox
#Pull ubuntu 16.04 base image
FROM ubuntu:16.04
MAINTAINER charles-edouard.cady@sirehna.com
 
#Step 2
#Essential tools and xvfb
RUN apt-get update && apt-get install -y \
    software-properties-common \
    unzip \
    curl \
    wget \
    bzip2\
    xvfb
 
#Step 3
#Firefox
ARG FIREFOX_VERSION=59.0.2
RUN apt-get update \
  && apt-get -y --no-install-recommends install firefox \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/* \
  && wget --no-verbose -O /tmp/firefox.tar.bz2 https://download-installer.cdn.mozilla.net/pub/firefox/releases/$FIREFOX_VERSION/linux-x86_64/en-US/firefox-$FIREFOX_VERSION.tar.bz2 \
  && apt-get -y purge firefox \
  && rm -rf /opt/firefox \
  && tar -C /opt -xjf /tmp/firefox.tar.bz2 \
  && rm /tmp/firefox.tar.bz2 \
  && mv /opt/firefox /opt/firefox-$FIREFOX_VERSION \
  && ln -fs /opt/firefox-$FIREFOX_VERSION/firefox /usr/bin/firefox
 
#GeckoDriver
ARG GECKODRIVER_VERSION=0.20.1
RUN wget --no-verbose -O /tmp/geckodriver.tar.gz https://github.com/mozilla/geckodriver/releases/download/v$GECKODRIVER_VERSION/geckodriver-v$GECKODRIVER_VERSION-linux64.tar.gz \
  && rm -rf /opt/geckodriver \
  && tar -C /opt -zxf /tmp/geckodriver.tar.gz \
  && rm /tmp/geckodriver.tar.gz \
  && mv /opt/geckodriver /opt/geckodriver-$GECKODRIVER_VERSION \
  && chmod 755 /opt/geckodriver-$GECKODRIVER_VERSION \
  && ln -fs /opt/geckodriver-$GECKODRIVER_VERSION /usr/bin/geckodriver
 
#Step 4
#Python 2.7 and Python Pip
RUN apt-get update \
 && apt-get install -y \
    python \
    python-setuptools \
    python-pip \
    libasound2 \
    libgtk2.0-0 \
 && apt-get autoremove -y

RUN pip install\
        selenium==2.53.0 \
        nose \
        rednose
RUN export DISPLAY=:20
RUN mkdir /test && chmod a+rwx /test
ADD tests.py /test

CMD export DISPLAY=:20 ; Xvfb :20 -screen 0 1366x768x16 & cd /test && nosetests -x -v -d --nocapture --nologcapture --rednose
