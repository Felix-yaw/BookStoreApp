# Build the application
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build-env
WORKDIR /app

# Copy the solution and project files
COPY ./BookStore.sln ./
COPY ./Application/Application.csproj ./Application/
COPY ./Domain/Domain.csproj ./Domain/
COPY ./Infrastructure/Infrastructure.csproj ./Infrastructure/
COPY ./Persistence/Persistence.csproj ./Persistence/
COPY ./BookStore/BookStore.csproj ./BookStore/
COPY ./Test/*.csproj ./Test/
# Restore the dependencies
RUN dotnet restore

# Copy the rest of the files
COPY . ./

# Install EF tools in the build environment
RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"

# Publish the application
RUN dotnet publish ./BookStore/BookStore.csproj -c Release -o /app/out

# Final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

# Copy the published application
COPY --from=build-env /app/out .

# Ensure the PATH includes the directory where dotnet-ef is installed
ENV PATH="$PATH:/root/.dotnet/tools"

# Expose the custom port
EXPOSE 5203

# Set environment variables
ENV ASPNETCORE_URLS=http://*:${PORT:-5203}
ENV ASPNETCORE_ENVIRONMENT=Development

# Copy and set permissions for the entrypoint script
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Run the entrypoint script
CMD ["./entrypoint.sh"]

