FROM gitpod/workspace-full

RUN sudo apt-get update && sudo apt-get install -y
RUN bash -l -c "nvm install v12.16.3 --reinstall-packages-from=node"
