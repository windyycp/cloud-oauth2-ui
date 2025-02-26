const fs = require('fs');

// 从环境变量中获取版本号，或者使用默认版本号
// const version = process.env.MY_VERSION || '1.1.0';
const packageJsonData = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const packageLockJsonData = JSON.parse(fs.readFileSync('./package-lock.json', 'utf-8'));

// 更新版本号
console.log('旧版本' + process.env.npm_package_version);
const version = incrementVersion(process.env.npm_package_version);
packageJsonData.version = version;
packageLockJsonData.version = version
packageLockJsonData.packages[""].version = version
process.env.npm_package_version = version;
// 将 packageJsonData 对象转换为 JSON 字符串
const packageJsonString = JSON.stringify(packageJsonData, null, 2);
const packageLockJsonDataString = JSON.stringify(packageLockJsonData, null, 2);

// 将 JSON 字符串写回 package.json 文件
fs.writeFileSync('./package.json', packageJsonString);
fs.writeFileSync('./package-lock.json', packageLockJsonDataString);

console.log('新版本' + process.env.npm_package_version);
console.log('package.json 文件已更新版本号。');

function incrementVersion(version) {
	const versionParts = version.split('.'); // 将版本号拆分为数组
	// 将最后一部分转换为整数并自增
	let lastPart = parseInt(versionParts[versionParts.length - 1]);
	lastPart++;
	// 如果超过100，需要进位到前一部分
	if (lastPart > 100) {
		lastPart = 0;
		versionParts[1] = parseInt(versionParts[1]) + 1;
	} else {
		versionParts[versionParts.length - 1] = lastPart;
	}

	// 如果第二部分超过100，需要进位到第一部分
	if (versionParts[1] > 100) {
		versionParts[1] = 0;
		versionParts[0] = parseInt(versionParts[0]) + 1;
	}

	// 将更新后的版本号拼接并返回
	const newVersion = versionParts.join('.');
	return newVersion;
}