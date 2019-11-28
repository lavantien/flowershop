FlowerShop
-
- Full features eCommerce modern web application powered by Spring Boot and Angular

#### Requirements:
1. `JDK 11`
2. `Node 13.12.0`
3. `NPM 6.13.1`
4. `MySQL Server 8`
5. `IntelliJ IDEA`
6. `Postman`

#### Development environment setup detail instruction:
1. Open root folder in `IntelliJ IDEA`.
2. Edit file `application.properties` (MySQL server's account and version) according to your database.
3. Running the first 2 lines in file `db/run.sql` to create a database (schema) name `flowershop` in the MySQL Server. 
4. Launch Spring Boot `FlowershopApplication`. The tables will be create if run the first time.
5. Run the rest in file `db/run.sql` to fill default data for our application.
6. In `Postman`, run POST at `http://localhost:8080/api/test` with the `JSON body` copied from `db/mock-test.json`.
7. In `Postman`, run POST at `http://localhost:8080/api/product` with the `JSON body` copied from `db/product.json`.
8. Run `npm install` in `cmd` (or `terminal`) inside `frontend` folder.
9. Open `frontend/package.json` and click on the `green arrow` beside `start-dev` to run `frontend` in development mode.
10. Open browser at `http://localhost:4200` to access our application.

#### Production environment setup detail instruction:
1. Production environment needs only `JDK 11` and `Maven` installed.
2. Run `mvn package` in `cmd` inside root folder. This will create a `Jar` package inside `target` folder named `flowershop-1.0.jar`.
3. Run this `Jar` package in `cmd` by this command `java -jar target/flowershop-1.0.jar`.
4. Access our application via an endpoint, for example an `AWS Cloud Endpoint`.