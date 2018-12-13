FROM python:3.6

LABEL maintainer "charles-edouard.cady@sirehna.com"

RUN apt-get update -yq \
 && apt-get install -y --no-install-recommends \
        libgl1-mesa-dev \
 && apt-get --purge -y --force-yes autoremove \
 && apt-get autoremove \
 && apt-get autoclean \
 && apt-get clean \
 && rm -rf /tmp/* /var/tmp/* /var/lib/apt/lists/*

RUN pip install \
    numpy \
    vtk

WORKDIR /work
ADD mesh2json.py /work


ENTRYPOINT ["python3", "mesh2json.py"]
