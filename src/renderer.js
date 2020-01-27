// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const fs = require('fs')

let path = ''
if (process.platform === 'win32') {
    path = "C:\\WINDOWS\\system32\\drivers\\etc\\hosts"
} else {
    path = "/etc/hosts"
}

const textarea = document.getElementById('hosts')
const save_btn = document.getElementById('save')
const reload_btn = document.getElementById('reload')

function reload() {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, content) => {
            if (err) {
                reject()
            } else {
                textarea.value = fs.readFileSync(path,  'utf8')
                resolve()
            }
        })

    })
}

function disable_button() {
    save_btn.setAttribute('disabled', 'disabled')
    reload_btn.setAttribute('disabled', 'disabled')
}

function enable_button() {
    save_btn.removeAttribute('disabled')
    reload_btn.removeAttribute('disabled')
}

save_btn.addEventListener('click', function () {
    disable_button()
    fs.writeFileSync(path, textarea.value)
    let saved_notification = new Notification('Hosts Editor', {
        body: 'Save successful!'
    })
    setTimeout(() => {
        saved_notification.close()
        enable_button()
    }, 2000)
})

reload_btn.addEventListener('click', function () {
    disable_button()
    reload()
        .then(() => {
            let loaded_notification = new Notification('Hosts Editor', {
                body: 'Reload successful!'
            })
            setTimeout(() => {
                loaded_notification.close()
                enable_button()
            }, 2000)
        })
})

reload()
