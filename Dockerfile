FROM php:8.2-apache

# Instala bibliotecas necessárias e extensões PDO para MySQL e PostgreSQL
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql

# Habilita o módulo de reescrita do Apache (opcional, mas comum)
RUN a2enmod rewrite

# Copia os arquivos do projeto para o diretório padrão do Apache
COPY . /var/www/html/

# --- CORREÇÃO DE PERMISSÕES ---
# 1. Cria a pasta uploads caso ela não exista no copiado
RUN mkdir -p /var/www/html/public/uploads

# 2. Dá a posse de TUDO para o usuário do Apache (www-data)
# O padrão é 'root', por isso o PHP (que roda como www-data) não conseguia escrever.
RUN chown -R www-data:www-data /var/www/html

# 3. Ajusta as permissões de escrita (755 é seguro e permite escrita pelo dono)
RUN chmod -R 755 /var/www/html
# ------------------------------

# Define o diretório padrão do Apache
WORKDIR /var/www/html