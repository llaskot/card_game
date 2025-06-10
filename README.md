# ======⚠️ Note: This steps only needs to be done once during the initial setup:
# To install run 'npm install'
If not works go to src/frontend_react and run npm install here.

# Then you need setup db.sql
1. Go to in project to 'src\backend';
2. Run db.sql file script in order to crate data base.
==================================================================================

# To run card game run 'npm start'
* You need to be in main directory of project.
* Ports 2567 and 3000 must be free to use.
# To stop press Ctrl + C two times


# Welcome to Colyseus!

This project has been created using [⚔️ `create-colyseus-app`](https://github.com/colyseus/create-colyseus-app/) - an npm init template for kick starting a Colyseus project in TypeScript.

[Documentation](http://docs.colyseus.io/)

## :crossed_swords: Usage

```
npm start
```

## Structure

- `index.js`: main entry point, register an empty room handler and attach [`@colyseus/monitor`](https://github.com/colyseus/colyseus-monitor)
- `src/rooms/MyRoom.js`: an empty room handler for you to implement your logic
- `src/rooms/schema/MyRoomState.js`: an empty schema used on your room's state.
- `loadtest/example.js`: scriptable client for the loadtest tool (see `npm run loadtest`)
- `package.json`:
    - `scripts`:
        - `npm start`: runs `node index.js`
        - `npm test`: runs mocha test suite
        - `npm run loadtest`: runs the [`@colyseus/loadtest`](https://github.com/colyseus/colyseus-loadtest/) tool for testing the connection, using the `loadtest/example.js` script.
- `tsconfig.json`: TypeScript configuration file


## License

MIT

