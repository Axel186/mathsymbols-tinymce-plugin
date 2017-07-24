var plugin = (editor) => {

  // Config:
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const elementClassName = "tinymce-mathText";
  const mathMarkSymbol = "`";
  let targetFrame;

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  editor.addButton('mathSymbols', {
    text: false,
    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJ' +
    'lYWR5ccllPAAAAQJJREFUeNpi/P//PwMlgImBQkCxASxgU5iwmmMBxCX4NP/79y+EBY+8PBCfAuIucr2gB8RHyA0DBSBWA+LzSIZtQcLR6AbsgOJ' +
    'YKN8YiC8B8XcoHyS+Eoh9gPgakjq4AR5A3AbEBlC+FRAfRHJRKRDvBuJ4aMDvw+aFM0CsBcQiUPoMVFwSavsEIDYEYiMgvozNgG9AfA6Ic6D0N6j' +
    '4FKh3IqAaWYF4O65A3AvEXlAaBmRBzoYmeVOoAVLwLICUFxiBmA+Ir0K9wQvEgkBcBhW7Cg2DjUC8CKQWpJcRTDAywgwAuWgSNNCYoQHGAhVngqr' +
    '5C8S/gfgPUO8nxgHPjQABBgBsa0S64vNBPgAAAABJRU5ErkJggg==',
    tooltip: 'Math Symbols',
    onclick: () => {
      openMathTextEditor(undefined, function (e) {
        // Insert content when the window form is submitted
        var value = e.data.title.trim();
        var element = tinymce.activeEditor.dom.create('span', {class: elementClassName}, getMathText(value));

        editor.selection.setNode(element);
      });
    }
  });

  editor.on("click", function (e) {
    if (e.target.className === elementClassName) {
      var element = e.target;
      var currentValue = element.innerHTML.substr(1, element.innerHTML.length - 2);
      openMathTextEditor(currentValue, function (e) {
        // Insert content when the window form is submitted
        var value = e.data.title.trim();
        element.innerHTML = getMathText(value);
      });
    }
  });

  // Functions:
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  var openMathTextEditor = function (prevValue, submit) {
    prevValue = prevValue || "";

    // Open window
    editor.windowManager.open({
      title: 'mathSymbols plugin',
      width: 600,
      height: 300,
      body: [
        {
          type: 'container',
          html: '<p style="font-size: 14px">Use AsciiMath syntax: <a href="http://asciimath.org/#syntax" ' +
          'target="_blank">http://asciimath.org/#syntax</a></p>',
        }, {
          type: 'textbox',
          name: 'title',
          label: 'Math content:',
          value: prevValue,
          onKeyUp: function (e) {
            var value = this.value().trim();

            if (value != prevValue) {
              UpdateMath(value, document.getElementById('MathTextOutput'));
              prevValue = value;
            }
          }
        }, {
          type: 'container',
          html: '<iframe id="MathTextOutput" style="height: 200px"></iframe>',
          height: 200
        }
      ],
      onsubmit(e) {
        const MathJax = target.contentWindow.MathJax;
        const frame = document.getElementById('tinymce_ifr');

        // Insert content when the window form is submitted
        submit(e);
      }
    });

    // Adding Iframe - render the Math Text preview section.
    const target = document.getElementById('MathTextOutput');
    targetFrame = target.contentWindow || ( target.contentDocument.document || target.contentDocument);

    targetFrame.document.open();
    const html = '<html><head>' +
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-MML-AM_CHTML">' +
      '</script><style>html, body{font-size: 30px;} #MathJax_Message{font-size: 14px !important;}</style>' +
      '</head><div id="math">' + getMathText(prevValue) + '</div></html>';
    targetFrame.document.write(html);
    targetFrame.document.close();
  };

  // Update text and rerender the Math image.
  const UpdateMath = function (TeX, target) {
    const MathJax = target.contentWindow.MathJax;
    const mathWrapper = target.contentDocument.getElementById("math");

    mathWrapper.style.visibility = 'hidden';
    mathWrapper.innerHTML = '';

    const el = document.createElement("span");
    el.className = "math-text";
    el.innerText = mathMarkSymbol + TeX + mathMarkSymbol;

    mathWrapper.appendChild(el);

    MathJax.Hub.Queue(['Typeset', MathJax.Hub, el], function () {
      mathWrapper.style.visibility = 'visible';
    });
  };

  const getMathText = function (value) {
    return mathMarkSymbol + value + mathMarkSymbol;
  };
};

export default plugin;
