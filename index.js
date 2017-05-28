const formsEl = document.getElementById('forms-container')
const submitBtn = document.getElementById('submit')
let messageEl = document.getElementById('message')
let formCount = 0 // the number of file forms that are currently rendered

// render one form by default
appendForm()

submitBtn.addEventListener('click', createGist)
document.getElementById('add-file').addEventListener('click', appendForm)

function createGist () {
  var archive
  DatArchive.create({
    title: document.querySelector('input[name="title"]').value || '',
    description: document.querySelector('input[name="description"]').value || ''
  })
    .then(function (res) {
      archive = res

      // Figure out which files need to be added
      var fileForms = document.querySelectorAll('form')
      var promises = []

      for (var i = 0; i < fileForms.length; i++) {
        var form = fileForms[i]
        var path = form.path.value
        var content = form.content.value

        if (path && content) {
          promises.push(archive.writeFile(path, content))
        }
      }

      Promise.all(promises)
        .then(function (data) {
          archive.commit()
          window.location = archive.url
        })
    })
    .catch(function (err) {
      console.error(err)
      renderMsg('Something went wrong', 'error')
    })
}

function appendForm () {
  formCount += 1
  let form = document.createElement('form')
  form.id = 'add-file-form-' + formCount

  const formContent = `
    <!-- TODO allow user to do any kind of file -->
    <input autofocus name="path" placeholder="Filename including extension"/>
    <textarea name="content"></textarea>
  `

  form.innerHTML = formContent

  if (formCount !== 1) {
    var removeBtn = document.createElement('button')
    removeBtn.innerText = 'X'
    removeBtn.dataset.form = form.id
    removeBtn.addEventListener('click', removeForm)
    form.appendChild(removeBtn)
  }
  formsEl.appendChild(form)
}

function removeForm (e) {
  const form = document.getElementById(e.target.dataset.form)
  mainEl.removeChild(form)
}

function renderMessage (msg, type) {
  messageEl.innerText = msg
  if (type) messageEl.classList.add(type)
  window.setTimeout(function () {
    messageEl.classList.remove('error')
    messageEl.innerText = ''
  }, 4000)
}
