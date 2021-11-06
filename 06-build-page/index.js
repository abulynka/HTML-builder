const fsPromises = require('fs/promises');
const path = require('path');
const { EOL } = require('os');

async function recreateDir(to) {
  to = path.normalize(to);
  try {
    await fsPromises.stat(to);
    await fsPromises.rm(to, {recursive: true});
  } catch (e) {
    // nothing to do
  }
  await fsPromises.mkdir(to);
}

async function buildHtml(templatePath, htmlsFrom, htmlTo) {
  templatePath = path.normalize(templatePath);
  htmlsFrom = path.normalize(htmlsFrom);
  htmlTo = path.normalize(htmlTo);

  let html = (await fsPromises.readFile(templatePath)).toString();

  for (const element of (await fsPromises.readdir(htmlsFrom, {withFileTypes: true}))) {
    if (element.isFile() === false) {
      continue;
    }

    const extension = path.parse(element.name).ext.split('.').join('');
    if (extension !== 'html') {
      continue;
    }

    html = html.replaceAll(
      `{{${ path.parse(element.name).name }}}`,
      await fsPromises.readFile(path.normalize(htmlsFrom + '/' + element.name)));
  }

  await fsPromises.writeFile(htmlTo, html);
}

async function mergeCss(fromDirectory, toFile) {
  fromDirectory = path.normalize(fromDirectory);
  toFile = path.normalize(toFile);

  try {
    await fsPromises.stat(toFile);
    await fsPromises.rm(toFile);
  } catch (e) {
    // nothing to do
  }

  for (const element of (await fsPromises.readdir(fromDirectory, {withFileTypes: true}))) {
    const from = path.normalize(fromDirectory + '/' + element.name);

    if (element.isFile() === false) {
      continue;
    }

    const extension = path.parse(element.name).ext.split('.').join('');
    if (extension !== 'css') {
      continue;
    }

    await fsPromises.appendFile(
      toFile,
      await fsPromises.readFile(from) + EOL
    );
  }
}

async function copyDir(from, to) {
  from = path.normalize(from);
  to = path.normalize(to);

  if (await fsPromises.access(from) === false) {
    throw new Error('File or directory ' + from + ' does not exist');
  }

  try {
    await fsPromises.stat(to);
    await fsPromises.rm(to, {recursive: true,});
  } catch (e) {
    // nothing to do
  }
  await fsPromises.mkdir(to);

  for (const element of (await fsPromises.readdir(from, {withFileTypes: true}))) {
    const pathFrom = path.normalize(from + '/' + element.name);
    const pathTo = path.normalize(to + '/' + element.name);

    if (element.isDirectory()) {
      await copyDir(
        pathFrom,
        pathTo);
    } else if (element.isFile()) {
      await fsPromises.copyFile(pathFrom, pathTo);
    }
  }
}

async function process() {
  await recreateDir(__dirname + '/project-dist');
  await buildHtml(__dirname + '/template.html', __dirname + '/components', __dirname + '/project-dist/index.html');
  await mergeCss(__dirname + '/styles', __dirname + '/project-dist/style.css');
  await copyDir(__dirname + '/assets', __dirname + '/project-dist/assets');
}

process().then();
