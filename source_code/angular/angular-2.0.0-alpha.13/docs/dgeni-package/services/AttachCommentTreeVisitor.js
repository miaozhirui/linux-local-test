module.exports = function AttachCommentTreeVisitor(ParseTreeVisitor, log) {

  function AttachCommentTreeVisitorImpl() {
    ParseTreeVisitor.call(this);
  }

  AttachCommentTreeVisitorImpl.prototype = {

    __proto__: ParseTreeVisitor.prototype,


    visit: function(tree, comments) {
      this.comments = comments;
      this.index = 0;
      this.currentComment = this.comments[this.index];

      if (this.currentComment) log.silly('comment: ' +
          this.currentComment.range.start.line + ' - ' +
          this.currentComment.range.end.line);

      ParseTreeVisitor.prototype.visit.call(this, tree);
    },

    // Really we ought to subclass ParseTreeVisitor but this is fiddly in ES5 so
    // it is easier to simply override the prototype's method on the instance
    visitAny: function(tree) {
      if (tree && tree.location && tree.location.start && this.currentComment) {
        if (this.currentComment.range.end.offset < tree.location.start.offset) {
          log.silly('tree: ' + tree.constructor.name + ' - ' + tree.location.start.line);
          tree.commentBefore = this.currentComment;
          this.currentComment.treeAfter = tree;
          this.index++;
          this.currentComment = this.comments[this.index];
          if (this.currentComment) log.silly('comment: ' + this.currentComment.range.start.line + ' - ' + this.currentComment.range.end.line);
        }
      }
      return ParseTreeVisitor.prototype.visitAny.call(this, tree);
    }
  };

  return AttachCommentTreeVisitorImpl;
};