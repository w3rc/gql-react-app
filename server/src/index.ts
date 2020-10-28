import 'dotenv/config';
import express, { Express } from 'express';
import { graphqlHTTP } from 'express-graphql';
import Schema from './schema/schema';
import mongoose from 'mongoose';

const app: Express = express();

mongoose.connect(
	`mongodb+srv://${process.env.MONGO_UID}:${process.env.MONGO_PWD}@${process.env.MONGO_URI}/${process.env.DB}?retryWrites=true&w=majority`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);
mongoose.connection.once('open', () =>
	console.log('Connected to database successfully...')
);

app.use(
	'/gql',
	graphqlHTTP({
		schema: Schema,
		graphiql: true,
	})
);

app.listen(process.env.PORT, () =>
	console.log(`App is listening on port ${process.env.PORT}`)
);
