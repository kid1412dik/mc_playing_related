FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY ./dist/ /usr/share/nginx/html
RUN touch /var/run/nginx.pid && \
  chown -R www-data:www-data /var/run/nginx.pid && \
  chown -R www-data:www-data /var/cache/nginx
USER www-data
