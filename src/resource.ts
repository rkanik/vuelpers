// import { isArray, isPlainObject, isString } from "lodash";
// import { createAPI } from "./axios";
// import { Cases } from "./types";

// enum METHODS {
// 	GET = "get",
// 	POST = "post",
// 	PUT = "put",
// 	PATCH = "patch",
// 	DELETE = "delete",
// }

// type METHOD = keyof typeof METHODS;

// type RouteObject = {
// 	path: string;
// 	method: METHOD;
// };
// type RouteArray = [string, METHOD];
// type Route = string | RouteArray | RouteObject;

// interface Routes<T = Route> {
// 	fetch?: T;
// 	fetchOne?: T;

// 	insertOne?: T;
// 	updateOne?: T;
// 	deleteOne?: T;
// }

// interface Config {
// 	baseURL: string;
// 	routes: Required<Routes<RouteObject>>;
// }

// type ApiInstance = ReturnType<>;

// type ResourceConfig = {
// 	baseURL: string;
// 	routes?: Routes;
// 	apiInstance?: ApiInstance;
// 	request?: {
// 		use?: any[];
// 		convertCase?: Cases;
// 	};
// 	response?: {
// 		use?: any[];
// 		convertCase?: Cases;
// 	};
// };

// class APIResource {
// 	// PROPERTIES
// 	private config: Config;
// 	private api: ApiInstance;

// 	constructor(config: ResourceConfig) {
// 		this.api = config.apiInstance || createAPI({ baseURL: config.baseURL });
// 		this.config = {
// 			baseURL: config.baseURL || "",
// 			routes: {
// 				fetch: this.toRouteObject(config.routes),
// 				fetchOne: this.toRouteObject(config.routes, "fetchOne", [
// 					"/:id",
// 					"GET",
// 				]),
// 				insertOne: this.toRouteObject(config.routes, "insertOne", [
// 					"/",
// 					"POST",
// 				]),
// 				updateOne: this.toRouteObject(config.routes, "updateOne", [
// 					"/:id",
// 					"PUT",
// 				]),
// 				deleteOne: this.toRouteObject(config.routes, "deleteOne", [
// 					"/:id",
// 					"DELETE",
// 				]),
// 			},
// 		};
// 	}

// 	// PRIVATE METHODS
// 	private toRouteObject = (
// 		routes?: Routes<Route>,
// 		path: keyof Routes<Route> = "fetch",
// 		fallback: RouteArray = ["/", "GET"]
// 	): RouteObject => {
// 		// ROUTE
// 		const route = routes && routes[path];
// 		// IF ARRAY CONVERT TO OBJECT
// 		if (isArray(route)) return { path: route[0], method: route[1] };
// 		// IF STRING CONVERT TO OBJECT
// 		if (isString(route)) return { path: route, method: fallback[1] };
// 		// IF OBJECT RETURN
// 		if (route && isPlainObject(route)) return route;
// 		// IF NOTHING RETURN FALLBACK
// 		return { path: fallback[0], method: fallback[1] };
// 	};

// 	// PUBLIC METHODS
// 	public fetch(query?: object) {
// 		const route = this.config.routes.fetch;
// 		return this.api.get(route.path, query);
// 	}

// 	public insetOne(data: any) {
// 		const route = this.config.routes.insertOne;
// 		return this.api.post(route.path, data);
// 	}

// 	public fetchOne(id: any, query?: object) {
// 		const route = this.config.routes.fetchOne;
// 		return this.api.get(route.path.replace(":id", id), query);
// 	}

// 	public updateOne(id: any, data: any) {
// 		const route = this.config.routes.updateOne;
// 		return this.api.put(route.path.replace(":id", id), data);
// 	}

// 	public deleteOne(id: any) {
// 		const route = this.config.routes.updateOne;
// 		return this.api.delete(route.path.replace(":id", id));
// 	}
// }

// const Users = new APIResource({
// 	baseURL: "https://jsonplaceholder.typicode.com/users",
// 	request: {
// 		convertCase: "snake_case",
// 		use: [],
// 	},
// });


// export { APIResource };
