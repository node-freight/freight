function Queue() {
	var head = new Promise();
	var tail = head;

    this.put = function (value) {
		var next = new Promise();
        Settle(tail, FULFILLED, {
            value: value,
            next: next
        });
        tail = next;
    };

    this.get = function () {
        var result = head.then( getValue );
        head = head.then( getNext );
        return result;
    };
}

function getValue(x) {
	return x.value;
}

function getNext(x) {
	return x.next;
}
