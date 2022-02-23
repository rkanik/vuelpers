import axios, { Axios, AxiosInstance } from "axios";
import { isArray, isPlainObject, isString } from "lodash";
import { createAPI } from "./axios";
import { Cases } from "./types";

enum METHODS {
	GET = "get",
	POST = "post",
	PUT = "put",
	PATCH = "patch",
	DELETE = "delete",
}

type METHOD = keyof typeof METHODS;

type RouteObject = {
	path: string;
	method: METHOD;
};
type RouteArray = [string, METHOD];
type Resource = string | RouteArray | RouteObject;

interface Resources<T = Resource> {
	fetch?: T;
	fetchOne?: T;

	insertOne?: T;
	updateOne?: T;
	deleteOne?: T;
}

interface Config {
	baseURL: string;
	resources: Required<Resources<RouteObject>>;
}

type ApiInstance = ReturnType<typeof createAPI>;

type ResourceConfig = {
	baseURL: string;
	resources?: Resources;
	apiInstance?: ApiInstance;

	request?: {
		use?: any[];
		convertCase?: Cases;
	};
	response?: {
		use?: any[];
		convertCase?: Cases;
	};
};

const toRouteObject = (
	resources?: Resources<Resource>,
	path: keyof Resources<Resource> = "fetch",
	fallback: RouteArray = ["/", "GET"]
): RouteObject => {
	// ROUTE
	const resource = resources && resources[path];
	// IF ARRAY CONVERT TO OBJECT
	if (isArray(resource)) return { path: resource[0], method: resource[1] };
	// IF STRING CONVERT TO OBJECT
	if (isString(resource)) return { path: resource, method: fallback[1] };
	// IF OBJECT RETURN
	if (resource && isPlainObject(resource)) return resource;
	// IF NOTHING RETURN FALLBACK
	return { path: fallback[0], method: fallback[1] };
};

const defaultResources: Resources<RouteObject> = {
	fetch: toRouteObject(undefined),
	fetchOne: toRouteObject(undefined, "fetchOne", ["/:id", "GET"]),
	insertOne: toRouteObject(undefined, "insertOne", ["/", "POST"]),
	updateOne: toRouteObject(undefined, "updateOne", ["/:id", "PUT"]),
	deleteOne: toRouteObject(undefined, "deleteOne", ["/:id", "DELETE"]),
};

const createRK = (
	{
		baseURL,

		resources = defaultResources,
	}: ResourceConfig,
	dsadas?: string
) => {
	const instance = axios.create({
		baseURL,
	});

	return {
		fetch(query?: any) {
			return instance.get("/", query);
		},
		use() {},
	};
};

const config: ResourceConfig = {
	baseURL: "https://api.example.com",

	resources: {
		fetch: ["/index", "GET"],
	},
};

const api = createRK(config);

const a = {
	...api,
	dasdsad() {
		return api.fetch();
	},
};
