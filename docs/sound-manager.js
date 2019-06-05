export class SoundManager {
    constructor(manifest) {
        this.manifest = manifest
    }
    // preloader
    async  init() {
        this.buffers = {}
        this.decoded = false
        for await (let item of this.manifest) {
            let buffer = await this.load(item.url)
            if (buffer) {
                this.buffers[item.id] = buffer;
            }
        }
    }
    // must be called after first user interaction
    async decode() {
        if (this.decoded) {
            return
        }
        this.context = new AudioContext()
        for await (let kv of Object.entries(this.buffers)) {
            this.buffers[kv[0]] = await this.context.decodeAudioData(kv[1])
        }
        this.decoded = true;
    }

    async play(id, loop, cb) {

        if (this.current) {
            await this.current.stop()
        } else {
            await this.decode()
        }
        try {
            let source = this.context.createBufferSource();
            source.loop = loop
            source.buffer = this.buffers[id]
            source.connect(this.context.destination);

            this.current = source
            if (cb) {
                source.addEventListener('ended', cb)
            }
            source.start(0)
        }
        catch (e) {
            console.log(`Failed to play sounds ${id}`)
        }
    }
    async  load(url) {
        try {
            var myRequest = new Request(url);
            let response = await fetch(myRequest)
            return await response.arrayBuffer();

        } catch (e) {
            console.log(`Failed to load ${url}`)
        }
        return undefined;
    }
}






