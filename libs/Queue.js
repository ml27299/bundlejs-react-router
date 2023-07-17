class Queue {
	constructor() {
		this.queue = [];
		this.running = false;
	}
	add(fn, onLoading, route) {
		this.queue.push({ fn, onLoading, route });
		if (this.queue.length === 1) this.run();
	}
	run() {
		if (this.running || this.queue.length === 0) return;
		this.running = true;
		const { fn, onLoading, route } = this.queue[this.queue.length - 1];
		this.queue = [];
		fn()
			.then(() => {
				if (this.queue.length) {
					this.running = false;
					this.run();
				} else {
					onLoading(false, route);
					this.running = false;
				}
			})
			.catch((err) => {
				console.log(err);
				if (this.queue.length) {
					this.running = false;
					this.run();
				}
			});
	}
}

export default Queue;
