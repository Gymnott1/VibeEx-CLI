function removeComments(content, fileExtension) {
  switch (fileExtension) {
    case '.js':
    case '.ts':
      return content.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
    case '.py':
      return content.replace(/#.*|""".*?"""|\'\'\'.*?\'\'\'/gs, '');
    case '.html':
    case '.xml':
      return content.replace(/<!--.*?-->/gs, '');
    case '.css':
      return content.replace(/\/\*[\s\S]*?\*\//g, '');
    case '.sh':
      return content.replace(/#.*/g, '');
    case '.rb':
      return content.replace(/#.*|=begin.*=end/gs, '');
    default:
      return content;
  }
}

export { removeComments };
