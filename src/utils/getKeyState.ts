export function getKeyState<State, SelectorOutput>(state: State, callback: (state: State) => SelectorOutput) {
   return callback(state)
}