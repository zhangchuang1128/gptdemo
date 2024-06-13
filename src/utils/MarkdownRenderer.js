import MarkdownIt from 'markdown-it';
// import mdhljs from 'markdown-it-highlightjs';
import hljs from 'highlight.js';
// import 'highlight.js/styles/github-dark.css';
import 'highlight.js/styles/a11y-dark.css'
// import './pcIndex.css'


export default function MarkdownRenderer() {
    const md = new MarkdownIt({
        // highlight(str, lang) {
        //     if (lang && hljs.getLanguage(lang)) {
        //         try {
        //             return '<pre class="hljs"><code>' + hljs.highlight(lang, str, true).value + '</code></pre>';
        //         } catch (__) {
        //         }
        //     }
        //     return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
        // }

        highlight(code, lang) {
            // 通过时间戳生成唯一标识
            const codeIndex = parseInt(Date.now() + "") + Math.floor(Math.random() * 10000000);
            if (code) {
                try {
                    // console.log(`代码 | 字符 str ：${code}`)
                    // 使用 highlight.js 对代码进行高亮显示
                    const preCode = hljs.highlightAuto(code).value;
                    // 将代码包裹在 textarea 中，由于防止textarea渲染出现问题，这里将 "<" 用 "&lt;" 代替，不影响复制功能
                    return `
<pre class='hljs-customer hljs copyParent'>
    <span class="code-block-header copyHeader">
        <span class="copyChildrenCopy" id='copy-btn' data-clipboard-action="copy" data-clipboard-target="#copy${codeIndex}">复制代码</span><span class="copyChildrenSpan">${lang}</span>
    </span>
<code>${preCode}</code>
</pre>
<textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${codeIndex}">${code.replace(/<\/textarea>/g, "&lt;/textarea>")}</textarea>`;
                } catch (e) {
                    console.log(`code报错:${e}`)
                }
            }
        }
    });
    // md.use(mdhljs);
    return md;
}
