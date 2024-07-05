# Bakery Pet Backend

This is the server-side application for the Bakery Pet project. It is built using Node.js, Express, and MongoDB.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Related Projects](#related-projects)

## Technologies Used

- Node.js
- Express
- MongoDB
- JWT for authentication

## Features

- User authentication and authorization
- Create, view, update, and delete orders
- Secure RESTful API

## Getting Started

### Prerequisites

- Node.js (>=14.x.x)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:

```bash
git clone https://github.com/DenysVM/bakery-pet-backend.git
cd bakery-pet-backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables. Create a `.env` file in the `server` directory with the following content:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the development server:

```bash
npm run dev
```

### API Endpoints

- `POST /api/orders`: Create a new order.
- `GET /api/orders`: Get all orders for the authenticated user.
- `PUT /api/orders/:orderId/items/:itemId`: Update an item in an order.
- `DELETE /api/orders/:orderId/items/:itemId`: Delete an item from an order.
- `DELETE /api/orders/:orderId`: Delete an entire order.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Related Projects

- [Bakery Pet Client](https://github.com/DenysVM/bakery-pet): The client-side application for the Bakery Pet project.
