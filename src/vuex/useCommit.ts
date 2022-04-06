import { MutationType, Payload } from '../types'
import { ActionTree, MutationTree, Commit } from 'vuex'

export const useMutations = <State>() => {
	// Use Commit
	const useCommit = <Type extends MutationType>(
		commit: Commit,
		type: Type,
		payload: Payload<State>[Type]
	) => {
		return commit(type as unknown as string, payload)
	}

	const mutations: MutationTree<State> = {}

	return {
		useCommit,
		mutations,
	}
}

type User = {
	id: number
	name: string
	email: string
	age: number
}

export type State = {
	users: User[]
	loading: boolean
	currentUser: User
}

const user: User = {
	id: 1,
	age: 30,
	name: 'John',
	email: 'john@doe.com',
}

const state: State = {
	users: [],
	loading: false,
	currentUser: user,
}

const { mutations, useCommit } = useMutations<State>()

const actions: ActionTree<State, any> = {
	async initialize({ commit }) {
		useCommit(commit, 'SET', {
			'users.0.age': 30,
			'currentUser.age': 30,
			loading: true,
		})

		useCommit(commit, 'MERGE', {
			users: {
				items: [user],
				matchBy: 'id',
			},
		})

		useCommit(commit, 'PUSH', {
			users: {
				item: user,
			},
		})
	},
}
