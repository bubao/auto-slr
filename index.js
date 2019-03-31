const { SLR } = require("ml-regression");
let status = {};

function auto(
	input,
	reference,
	options,
	count = 0,
	results = [],
	regression,
	tempInput = [],
	tempReference = []
) {
	if (count + 1 > input.length) {
		results.push({
			func: status.func,
			start: status.start,
			end: tempReference[tempReference.length - 1]
		});
		return results;
	} else {
		if (input[count] !== tempInput[0]) {
			tempInput.push(input[count]);
			tempReference.push(reference[count]);
		}
		if (tempInput.length === 1) {
			count += 1;
			tempInput.push(input[count]);
			tempReference.push(reference[count]);
		}
		regression = new SLR(tempInput, tempReference);
		const target = verify(
			regression,
			tempInput,
			tempReference,
			options.scope
		);
		if (target) {
			count++;
			status = {
				start: tempReference[0],
				func: regression
					.toString(options.decimal)
					.replace("f(x) = ", ""),
				end: status.end
			};
			return auto(
				input,
				reference,
				options,
				count,
				results,
				regression,
				tempInput,
				tempReference
			);
		} else {
			results.push({
				func: status.func,
				start: status.start,
				end: reference[count - 1]
			});
			status = { start: reference[count - 1] };
			return auto(
				input,
				reference,
				options,
				count - 1,
				results,
				regression
			);
		}
	}
}
function verify(regression, tempInput, tempReference, scope = 1, count = 0) {
	if (tempInput.length === count) return true;
	let target;
	for (let index = 0; index < count + 1; index++) {
		target =
			Math.abs(
				tempReference[index] -
					regression.predict(parseFloat(tempInput[index]))
			) < scope;
		if (!target) break;
	}
	if (!target) return false;
	return verify(regression, tempInput, tempReference, scope, count + 1);
}
module.exports = (input, reference, options = { scope: 1, decimal: 5 }) => {
	if (input.length > 1 || input.length === reference.length)
		return auto(input, reference, options);
};
