# Build image
#   docker build -f ci_docker/Dockerfile_Debian_Python3 -t spt_py3 .
#
# Delete image
#   docker rmi spt_py3
#
# Run container
#   docker run --name test_spt_py3 spt_py3
#   docker stop test_spt_py3
#   docker rm test_spt_py3
#
# Run interactive
#   docker run -it spt_py3 /bin/bash
#
#
# vtk package that is installed with PIP requires:
#
#  - libgl1-mesa-dev
#  - libxt-dev

FROM debian:9.6

LABEL maintainer "guillaume.jacquenot@sirehna.com"

ENV RUN_DEPENDENCIES \
        libgl1-mesa-dev \
        libxt-dev \
        make \
        pandoc \
        python3 \
        python3-chardet \
        python3-coverage \
        python3-dev \
        python3-h5py \
        python3-jinja2 \
        python3-matplotlib \
        python3-nose \
        python3-numexpr \
        python3-numpy \
        python3-pandas \
        python3-pep8 \
        python3-pip \
        python3-scipy \
        python3-setuptools \
        python3-sphinx \
        python3-sympy \
        python3-wheel \
        python3-yaml

RUN apt-get update -yq && \
    apt-get install -y --no-install-recommends $RUN_DEPENDENCIES && \
    rm -rf /tmp/* /var/tmp/* && \
    rm -rf /var/lib/apt/lists/ && \
    apt-get --purge -y --force-yes autoremove && \
    apt-get autoremove && \
    apt-get autoclean && \
    apt-get clean && \
    rm -rf /tmp/* /var/tmp/* /var/lib/apt/lists/*

ENV PYTHON3_PIP_DEPENDENCIES \
        numpy-stl \
        pint \
        sphinxcontrib-bibtex \
        vtk \
        xlsxwriter \
        xlrd \
        pyxlsb

RUN pip3 install $PYTHON3_PIP_DEPENDENCIES

WORKDIR /spt
ADD vtkRayIntersection.py /spt


ENTRYPOINT ["python3", "vtkRayIntersection.py"]
