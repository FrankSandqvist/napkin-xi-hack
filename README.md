## NAPKIN

This is my submission for the Elevenlabs 2025 hackathon.

### Things to note

Due to the time constraints of a hackathon, and the fact that this is only a proof of concept, there are some things to note about how things are implemented.

- *Almost* everything is client-side. For a real app, we would need a database and proper backend
- This also means that we are not able to use backend tools for the 11labs agent, so I had to do some hacks on the client tools to make it work (signature for calling the "calculate" function, etc.)
    - Client overrides of system message is not a great way to do it 😅
- There are some ugly solutions to avoid stale state in the product page for the client tools, but I couldn't get it to work so I just used useRef.