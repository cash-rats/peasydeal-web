#!/bin/bash

# Check if a repository name has been passed as an argument
if [ $# -eq 0 ]; then
	echo "No repository name supplied. Usage: $0 <repository-name>"
	exit 1
fi

# Set your variables
REGION=ap-southeast-1
REPO_NAME=$1
REPO_URL=920786632098.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME
PROFILE_NAME=peasydeal

# Login to AWS ECR
# aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $REPO_URL
aws ecr get-login-password --region $REGION --profile $PROFILE_NAME | docker login --username AWS --password-stdin $REPO_URL

# Push the Docker image to ECR
docker push $REPO_URL:latest

# Check if the push was successful
if [ $? -eq 0 ]; then
	echo "Docker image pushed successfully."
else
	echo "Failed to push Docker image."
fi
