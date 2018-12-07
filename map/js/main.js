const elCodeArea = document.getElementById("code_area"),
  elOpenCode = document.getElementById("code_open"),
  elContainer = document.getElementById("container"),
  elTextArea = document.getElementById("myresource"),
  elCloseCode = document.getElementById("code_close");

var elCodeEditor;

function initMenu() {
  let template = `
  <ul>
    <% for(let i=0; i < data.groups.length; i++) { %>
    <li id="list_item<%= i %>">
        <a class="one_head" listid="<%= i %>"><i class="t_close"></i><%= data.groups[i].name %></a>
        <div id="submenu<%= i %>" class="submenu">
            <dl>
                <% for(let j=0; j < data.groups[i].items.length; j++) { let item=data.groups[i].items[j] %>
                <dd>
                  <a href="<%= data.url + item.id %>.html" onClick="setIntro('<%= item.id %>');return false;" target="container">
                  <%= item.name %>
                    <% if(item.isNew) { %>
                    <span style="font-size: 10px; padding-left: 5px; color: red;">new</span>
                    <% } %>
                  </a>
                </dd>
                <% } %>
            </dl>
        </div>
    </li>
    <% } %>
  </ul>
  `;
  let context = compileTemplate(template);
  $.ajax({
    url: "files/examples.json",
    method: "get"
  }).then(json => {
    json = typeof json === "string" ? JSON.parse(json) : json;
    let html = context(json);
    $("#menu").html(html);
    var menu_head = $("#menu ul>li>a");
    var menu_body = $("#menu ul>li>.submenu");
    var menu_i = $("#menu ul>li>a>i");
    var flag = 0;
    menu_head.on("click", function(event) {
      if (!$(this).hasClass("open clickState")) {
        var des = ($(this).attr("listid") - 1) * 52;
        $("#menu").animate({ scrollTop: des }, 200);
        //slideToggle
        menu_body.slideUp("fast");
        $(this)
          .next()
          .stop(true, true)
          .slideToggle("fast");
        menu_head.removeClass("open clickState");
        menu_i.removeClass("t_open");
        menu_i.addClass("t_close");
        $(this).addClass("open clickState");
        $(this)
          .find("i")
          .addClass("t_open");
      } else {
        if (flag == $(this).attr("listid")) {
          $(this).removeClass("open");
        } else {
          $(this).removeClass("open clickState");
        }
        $(this)
          .find("i")
          .removeClass("t_open")
          .addClass("t_close");
        $(this)
          .parents("li")
          .find(".submenu")
          .slideUp("fast");
      }
    });
    $(".submenu a").on("click", function() {
      flag = $(this)
        .parents("li")
        .find(".one_head")
        .attr("listid");
      if (!$(this).hasClass("clickState")) {
        $(".submenu a").removeClass("clickState");
        $(this).addClass("clickState");
      }
      //代码宽度还原
      $("#code_area").width(500);
    });
    menuLocation();
  });
}

var run = (function() {
  let updateViews = function() {
    var codeMirrorContent = elCodeEditor.getValue();
    var livePreview =
      elContainer.contentDocument || elContainer.contentWindow.document;
    livePreview.open();
    livePreview.write(codeMirrorContent);
    livePreview.close();
  };
  return function() {
    elCodeEditor && updateViews();
  };
})();

/** 复制功能 **/
var clip = null;
var copyTimer = null; //显示复制成功的定时器
function init() {
  // debugger;
  clip = new ZeroClipboard.Client();
  clip.setHandCursor(true);
  clip.addEventListener("load", function(client) {
    debugstr("Flash movie loaded and ready.");
  });
  clip.addEventListener("mouseOver", function(client) {
    // update the text on mouse over
    $("#d_clip_button").css({ fontWeight: "bold" });
    var iframeContent = $("#myresource").val();
    if (editor) {
      iframeContent = editor.getValue();
    }
    clip.setText(iframeContent);
  });
  clip.addEventListener("mouseOut", function(client) {
    $("#d_clip_button").css({ fontWeight: "normal" });
    // $("#d_clip_button").style.fontWeight = "normal";
  });
  clip.addEventListener("complete", function(client, text) {
    debugstr("Copied text to clipboard: " + text);
  });
  clip.glue("d_clip_button");
}

var initEditor = function() {
  if (!elCodeEditor) {
    elCodeEditor = CodeMirror.fromTextArea(
      document.getElementById("myresource"),
      {
        mode: "text/xml",
        mode: "text/html",
        lineNumbers: true,
        lineWrapping: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        matchBrackets: true
      }
    );
    setIntro();
  } else {
    elCodeEditor.setValue(elTextArea.value);
  }
};

function clipCode() {
  clip.setText(elCodeEditor.getValue());
}

function refresh() {
  elContainer.value = localStorage.content;
  initEditor();
  run();
}

function setIntro(id = "xmap_basic") {
  elContainer.setAttribute("src", "examples/" + id + ".html");
  var location = window.location.toString();
  if (location.indexOf("#") > 0) {
    location = location.substr(0, location.indexOf("#"));
  }
  window.location = location += "#" + id;
  getresource();
  return false;
}

function getresource() {
  init();
  function createXmlHttpRequest() {
    try {
      return new XMLHttpRequest();
    } catch (e) {
      return new ActiveXObject("Microsoft.XMLHTTP");
    }
  }
  var mylink;
  let url = "examples/";
  if (window.location.toString().indexOf("#") == -1) {
    mylink = url + "xmap_basic.html";
  } else {
    mylink = url + window.location.toString().split("#")[1] + ".html";
  }
  var xmlHttp = createXmlHttpRequest();
  xmlHttp.open("get", mylink, false);
  xmlHttp.send();
  if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
    str = xmlHttp.responseText; //str即为返回的html内容
    str = str.replace(/\"\.\.\//g, '"');
    localStorage.content = str;
    elTextArea.value = str;
    initEditor();
    isInt = 1;
    isTab = 0;
  }
}

var toggleFooter = function() {
  if (event.currentTarget.id === "code_open") {
    elCodeArea.style.width = "500px";
    elOpenCode.style.display = "none";
    elCloseCode.style.display = "block";
  } else {
    elCodeArea.style.width = "0";
    elOpenCode.style.display = "block";
    elCloseCode.style.display = "none";
  }
  dragbar.refresh();
};

function menuLocation() {
  var id = window.location.toString().split("#")[1];
  localStorage.id = id;
  $("#menu a[href$='" + localStorage.id + ".html']")
    .parents("li")
    .find(".one_head")
    .addClass("open clickState");
  $("#menu a[href$='" + localStorage.id + ".html']")
    .parents("li")
    .find("i")
    .removeClass("t_close")
    .addClass("t_open");
  $("#menu a[href$='" + localStorage.id + ".html']")
    .parents(".submenu")
    .show();
  $("#menu a[href$='" + localStorage.id + ".html']").addClass("clickState");
  var des =
    ($("#menu a[href$='" + localStorage.id + ".html']")
      .parents("li")
      .find(".one_head")
      .attr("listid") -
      1) *
    52;
  $("#menu").animate({ scrollTop: des }, 0);
}

var compileTemplate = template => {
  const evalExpr = /<%=(.+?)%>/g;
  const expr = /<%([\s\S]+?)%>/g;

  /**
   * @prettier --print-width=80
   */
  template = template
    .replace(evalExpr, "`); \n  echo( $1 ); \n  echo(`")
    .replace(expr, "`); \n $1 \n  echo(`");

  template = "echo(`" + template + "`);";

  let script = `(function parse(data){
    let output = "";
    function echo(html){
      output += html;
    }
    ${template}
    return output;
  })`;

  return eval(script);
};
