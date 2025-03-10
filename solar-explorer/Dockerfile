# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.1.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

################################################################################
# Create a stage for installing production dependencies.
FROM base as deps

# Download dependencies as a separate step to take advantage of Docker's caching.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci 

################################################################################
# Create a stage for building the application.
FROM deps as build

# Install dev dependencies for build process
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the source files into the image.
COPY . . 

# Run the build script.
RUN npm run build

################################################################################
# Create a new stage to run the application
FROM base as final

# Use production node environment by default.
ENV NODE_ENV=production

# Copy package.json so that package manager commands can be used.
COPY package.json . 

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# Ensure correct permissions
RUN chown -R node:node /usr/src/app

# Switch to non-root user AFTER copying dependencies
USER node

# Expose the correct port
EXPOSE 4173

# Start the server properly
CMD ["npm", "run", "preview"]
