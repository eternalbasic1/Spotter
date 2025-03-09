# # Use an official Python runtime as a parent image
# FROM python:3.11

# # Set work directory
# WORKDIR /code

# # Install dependencies
# COPY requirements.txt /code/
# RUN apt-get update && apt-get install -y libreoffice
# RUN pip install -r requirements.txt

# # Copy project
# COPY . /code/

# # Expose the port the app runs on
# EXPOSE 8000

# # Run migrations and then the application:
# CMD sh -c "python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"


####################


FROM python:3.11

# Install LibreOffice
RUN apt-get update && apt-get install -y libreoffice

# Set the working directory
WORKDIR /app

# Copy project files
COPY . /app

# Install dependencies
RUN pip install -r requirements.txt

# Run migrations
RUN python manage.py migrate

EXPOSE 8000
# Start the application
# CMD gunicorn backend.wsgi:application --bind 0.0.0.0:8000

CMD sh -c "gunicorn backend.wsgi:application --bind 0.0.0.0:8000"