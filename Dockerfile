FROM gitpod/workspace-full

RUN bash -l -c "nvm install v12.16.3 --reinstall-packages-from=node"
