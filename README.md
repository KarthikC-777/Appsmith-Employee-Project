# Appsmith-Employee-Project

## Employee managment system using Nestjs, MongoDB, RabbitMQ, Appsmith(frontend).

#### How to run project ?

1. Clone the project using git clone command:

```html
  git clone https://github.com/KarthikC-777/Appsmith-Employee-Project.git
  cd Appsmith-Employee-Project
```

2. To install required dependencies and packages:

```html
    cd user-microservice
    npm install
    npm run start:dev
    
    Open new terminal window run the following commands:
    
    cd leave-microservice
    npm install
    npm run start:dev
```
3. Result (access localhost:3000/users):

![image](/result/1.png)

![image](/result/2.png)

4. Install ngrok and run the below command:
```html
    ngrok http 3000
```    
![image](/result/ngrokImage.png)

5. Go to appsmith website and import below file and add deploy key to the git repository(https://github.com/KarthikC-777/Appsmith-frontend-project).
```html
    git@github.com:KarthikC-777/Appsmith-frontend-project.git
```    
6. copy and paste the ngrok forwarding endpoint link to user and admin button on appsmith.

![image](/result/StartingPage.png)

7. project can be run using Docker by below command:
```html
    docker compose up
```
8. Appsmith result:

![image](/result/AdminSignin.png)

![image](/result/AdminDashBoard.png)

![image](/result/UserSignin.png)

![image](/result/ForgotEmailPage.png)
