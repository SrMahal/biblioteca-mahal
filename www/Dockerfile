FROM php:8.2-apache

# 1. Instala dependências do sistema
RUN apt-get update && apt-get install -y \
    libpq-dev \
    git \
    unzip \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql

# 2. Habilita o mod_rewrite do Apache
RUN a2enmod rewrite

# 3. Instala o Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4. Configuração do Apache para MVC
ENV APACHE_DOCUMENT_ROOT /var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 5. Limites do PHP para upload de vídeos grandes (até 2GB)
RUN echo "upload_max_filesize = 2048M" >> /usr/local/etc/php/php.ini \
 && echo "post_max_size = 2048M"       >> /usr/local/etc/php/php.ini \
 && echo "max_execution_time = 3600"   >> /usr/local/etc/php/php.ini \
 && echo "max_input_time = 3600"       >> /usr/local/etc/php/php.ini \
 && echo "memory_limit = 512M"         >> /usr/local/etc/php/php.ini

# 6. Define o diretório de trabalho
WORKDIR /var/www/html

# 7. Ajusta permissões
RUN chown -R www-data:www-data /var/www/html