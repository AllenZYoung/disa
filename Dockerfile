FROM colehansen/polymer

WORKDIR "/usr/src/app"

COPY . /usr/src/app

RUN ["bower", "--allow-root", "install"]

CMD ["polymer", "serve", "-H", "0.0.0.0", "-p", "80"]
