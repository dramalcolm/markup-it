var should = require('should');

var DraftText = require('../');
var markdown = require('../rules/markdown');

describe('Markdown', function() {
    var syntax = new DraftText(markdown);

    describe('Text to ContentState', function() {
        describe('Paragraphs', function() {
            it('should parse paragraph', function() {
                var blocks = syntax.toRawContent('Hello World').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello World');
                blocks[0].type.should.equal(DraftText.BLOCKS.PARAGRAPH);
            });

            it('should parse multiple paragraph', function() {
                var blocks = syntax.toRawContent('Hello World\n\nHello 2').blocks;

                blocks.should.have.lengthOf(2);
                blocks[0].type.should.equal(DraftText.BLOCKS.PARAGRAPH);
                blocks[0].text.should.equal('Hello World');

                blocks[1].type.should.equal(DraftText.BLOCKS.PARAGRAPH);
                blocks[1].text.should.equal('Hello 2');
            });
        });

        describe('Headings', function() {
            it('should parse header 1', function() {
                var blocks = syntax.toRawContent('# Hello').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello');
                blocks[0].type.should.equal(DraftText.BLOCKS.HEADING_1);
            });

            it('should parse header 2', function() {
                var blocks = syntax.toRawContent('## Hello').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello');
                blocks[0].type.should.equal(DraftText.BLOCKS.HEADING_2);
            });

            it('should parse header 3', function() {
                var blocks = syntax.toRawContent('### Hello').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello');
                blocks[0].type.should.equal(DraftText.BLOCKS.HEADING_3);
            });
        });

        describe('Blockquotes', function() {
            it('should parse single line blockquote', function() {
                var blocks = syntax.toRawContent('> Hello').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello');
                blocks[0].type.should.equal(DraftText.BLOCKS.BLOCKQUOTE);
            });
        });

        describe('Code Blocks', function() {
            it('should parse single line code blocks', function() {
                var blocks = syntax.toRawContent('    Hello').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello');
                blocks[0].type.should.equal(DraftText.BLOCKS.CODE);
            });

            it('should parse multi lines code blocks', function() {
                var blocks = syntax.toRawContent('    Hello\n    World').blocks;

                blocks.should.have.lengthOf(1);
                blocks[0].text.should.equal('Hello\nWorld');
                blocks[0].type.should.equal(DraftText.BLOCKS.CODE);
            });
        });

        describe('Blocks', function() {
            it('should parse heading + paragraph', function() {
                var blocks = syntax.toRawContent('# Hello\n\nWorld').blocks;

                blocks.should.have.lengthOf(2);
                blocks[0].type.should.equal(DraftText.BLOCKS.HEADING_1);
                blocks[0].text.should.equal('Hello');

                blocks[1].type.should.equal(DraftText.BLOCKS.PARAGRAPH);
                blocks[1].text.should.equal('World');
            });
        });

        describe('Inline Styles', function() {
            it('should parse bold', function() {
                var blocks = syntax.toRawContent('Hello **World**').blocks;

                blocks[0].type.should.equal(DraftText.BLOCKS.PARAGRAPH);
                blocks[0].text.should.equal('Hello World');
                blocks[0].inlineStyleRanges.should.have.lengthOf(1);
                blocks[0].inlineStyleRanges[0].style.should.deepEqual('BOLD');
                blocks[0].inlineStyleRanges[0].offset.should.equal(6);
                blocks[0].inlineStyleRanges[0].length.should.equal(5);
            });

            it('should parse italic', function() {
                var blocks = syntax.toRawContent('Hello _World_').blocks;

                blocks[0].type.should.equal(DraftText.BLOCKS.PARAGRAPH);
                blocks[0].text.should.equal('Hello World');
                blocks[0].inlineStyleRanges.should.have.lengthOf(1);
                blocks[0].inlineStyleRanges[0].style.should.deepEqual('ITALIC');
                blocks[0].inlineStyleRanges[0].offset.should.equal(6);
                blocks[0].inlineStyleRanges[0].length.should.equal(5);
            });

            it('should parse strikethrought', function() {
                var blocks = syntax.toRawContent('Hello ~~World~~').blocks;

                blocks[0].type.should.equal(DraftText.BLOCKS.PARAGRAPH);
                blocks[0].text.should.equal('Hello World');
                blocks[0].inlineStyleRanges.should.have.lengthOf(1);
                blocks[0].inlineStyleRanges[0].style.should.deepEqual('STRIKETHROUGH');
                blocks[0].inlineStyleRanges[0].offset.should.equal(6);
                blocks[0].inlineStyleRanges[0].length.should.equal(5);
            });
        });
    });

    describe.only('Links', function() {
        it('should parse link', function() {
            var content = syntax.toRawContent('[Hello World](page.md)');
            console.log(JSON.stringify(content, null, 4));

            content.blocks[0].type.should.equal(DraftText.BLOCKS.PARAGRAPH);
            content.blocks[0].text.should.equal('Hello World');
        });
    });

    describe('ContentState to Text', function() {
        it('should render headings', function() {
            var state = syntax.toRawContent('# Hello');
            var md = syntax.toText(state);

            md.should.equal('# Hello\n\n');
        });

        it('should render headings + paragraphs', function() {
            var state = syntax.toRawContent('# Hello\n\nWorld\nTest');
            var md = syntax.toText(state);

            md.should.equal('# Hello\n\nWorld\n\nTest\n\n');
        });

        it('should render code blocks', function() {
            var state = syntax.toRawContent('    Hello\n    World');
            var md = syntax.toText(state);

            md.should.equal('    Hello\n    World\n\n');
        });
    });
});


