pipeline {
    agent any 

    environment {
        POSTGRES_USER = 'postgres'
        POSTGRES_PASSWORD = 'postgres'
        POSTGRES_DB = 'test'
        DOCKER_IMAGE = 'nodejs_image'
        DOCKER_IMAGE_TAG = 'latest'
    }

    stages {
        stage('Setup Database') {
            steps {
                script {
                    // Start PostgreSQL container
                    sh """
                    docker run -d \
                        --name jenkins_db \
                        -e POSTGRES_USER=${POSTGRES_USER} \
                        -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
                        -e POSTGRES_DB=${POSTGRES_DB} \
                        -p 5432:5432 \
                        postgres:13
                    """
                }
            }
        }

        stage('Clone Repository') {
            steps {
                // Checkout the repository
                git branch: 'main', 'https://github.com/anil135/nodejs-demo.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                // Build Docker image
                sh """
                "docker build -t ${DOCKER_IMAGE}:${env.BUILD_NUMBER} ."
                """
            }
        }

        stage('Run Application') {
            steps {
                // Run the application in a container
                sh """
                docker run -d \
                    --name node_app \
                    -p 3000:3000 \
                    --link jenkins_db:db \
                    ${DOCKER_IMAGE}:${DOCKER_IMAGE_TAG}
                """
            }
        }

        stage('Cleanup') {
            steps {
                // Stop and remove PostgreSQL container
                sh 'docker stop jenkins_db || true'
                sh 'docker rm jenkins_db || true'
                sh 'docker stop node_app || true'
                sh 'docker rm node_app || true'
            }
        }
    }

    post {
        always {
            // Clean up Docker resources
            sh 'docker system prune -f'
        }
    }
}
