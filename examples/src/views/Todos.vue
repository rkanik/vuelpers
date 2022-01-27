<template>
	<v-container>
		<v-row>
			<v-col cols="12" sm="11" md="8" xl="5" class="mx-auto">
				<v-form
					ref="todoFormRef"
					v-model="isValidTodo"
					@submit.prevent="onSubmitTodo"
				>
					<v-card>
						<v-card-text class="pb-0">
							<v-text-field
								label="Title"
								v-model="todo.title"
								:rules="[required('Description')]"
								placeholder="Do something cool"
							></v-text-field>
							<v-textarea
								rows="3"
								v-model="todo.description"
								label="Description"
								:rules="[required('Description')]"
								placeholder="Do something cool"
							></v-textarea>
						</v-card-text>
						<v-card-actions class="px-3 pb-3">
							<v-spacer></v-spacer>
							<v-btn type="submit" color="primary">Create</v-btn>
						</v-card-actions>
					</v-card>
				</v-form>

				<v-subheader class="mt-5"> TODOS </v-subheader>
				<v-list dense two-line>
					<v-list-item
						v-for="(todo, todoIndex) in todos"
						:key="todo.id"
						class="elevation-2 rounded"
						:class="{ 'mt-3': todoIndex }"
					>
						<v-list-item-icon>
							<v-checkbox
								class="mt-0"
								hide-details="auto"
								v-model="todo.isCompleted"
								@change="onChangeIsCompleted(todo, $event)"
							/>
						</v-list-item-icon>
						<v-list-item-content>
							<v-list-item-title
								class="subtitle-1"
								:class="{ 'text-decoration-line-through': todo.isCompleted }"
							>
								{{ todo.title }}
							</v-list-item-title>
							<v-list-item-subtitle
								:class="{ 'text-decoration-line-through': todo.isCompleted }"
							>
								{{
									todo.description ||
									"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta ad ab dolorem blanditiis at, corrupti repudiandae sit dolores iste, sapiente quas hic maiores, odit molestiae beatae eaque ullam odio corporis libero tempora! Vero deserunt, laboriosam, ipsum, at ullam voluptate aperiam voluptatibus natus eligendi nisi aliquid necessitatibus voluptates est incidunt dolorem."
								}}
							</v-list-item-subtitle>
						</v-list-item-content>
						<v-list-item-actions>
							<v-btn icon color="error" @click="handleDeleteTodo(todo)">
								<v-icon>mdi-delete</v-icon>
							</v-btn>
						</v-list-item-actions>
					</v-list-item>
				</v-list>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { FetchAPI } from "../../../lib/fetch";

const api = new FetchAPI({
	apiCase: "camelCase",
	baseURL: "http://localhost:4000/api/v1",
});

type Model = {
	id: number;
	createdAt: string;
	updatedAt: string;
};

type Todo = Model & {
	title: string;
	description: string | null;
	isCompleted: boolean;
	deadline: string | null;
};

export default Vue.extend({
	name: "FetchAPI",
	data: () => ({
		todos: [] as Todo[],
		isValidTodo: null,
		todo: {
			title: "",
			description: "",
		} as Partial<Todo>,
	}),
	computed: {},
	async created() {
		let [error, response] = await api.get("/todos");
		if (!error) this.todos = response.todos;
		this.todos = this.todos.sort((a) => (a.isCompleted ? -1 : 1));
		this.todos.reverse();
	},
	methods: {
		required(name: string) {
			return (v: any) => {
				return !!v || `${name} is required`;
			};
		},
		async handleDeleteTodo(todo: Todo) {
			if (!confirm("Are you sure to delete this item?")) return;
			let [err] = await api.delete(`/todos/${todo.id}`);
			if (!err) {
				this.todos = this.todos.filter((eachTodo) => {
					return eachTodo.id !== todo.id;
				});
			}
		},
		async onChangeIsCompleted(todo: Todo, isCompleted: boolean) {
			let [err, res] = await api.patch(`/todos/${todo.id}`, {
				isCompleted,
			});
			if (!err) {
				this.todos = this.todos
					.map((eachTodo) => {
						if (eachTodo.id === todo.id) return res.todo;
						return eachTodo;
					})
					.sort((a) => (a.isCompleted ? 1 : -1));
			}
		},
		async onSubmitTodo() {
			const formRef = this.$refs.todoFormRef as any;
			if (!formRef.validate()) return;

			let [err, res] = await api.post("/todos", this.todo);
			if (!err) this.todos.unshift(res.todo);

			formRef.reset();
		},
	},
});
</script>
