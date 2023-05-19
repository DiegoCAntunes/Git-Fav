import { GithubUser } from "./GithubUser.js"

export class Favorites{
    constructor(root){
        this.root = document.querySelector(root)
        this.tbody = document.querySelector('table tbody')
        this.empty = document.querySelector('.empty')
        this.load()
        this.update()
        this.onadd()
    }

    createRow(){
        const tr = document.createElement('tr')
        tr.classList.add('gituser')
        tr.innerHTML = `
        <td>
            <img src="https://github.com/maykbrito.png" alt="github profile picture">
            <a href="" target="_blank">
                <p>Diego Antunes</p>
                <span>/ItsDigs</span>
            </a>
        </td>
        <td class="repositories">123</td>
        <td class="followers">1234</td>
        <td><button>Remove</button></td>`
        return tr
    }

    update(){

        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        })

        if (this.entries.length != 0){
            this.empty.classList.add('hide')
            this.empty.classList.remove('empty')
        } else if (this.entries.length == 0){
            this.empty.classList.remove('hide')
            this.empty.classList.add('empty')
        }

        this.entries.forEach(user => {
            const row = this.createRow()

            row.querySelector('img').src = `https://github.com/${user.login}.png`
            row.querySelector('img').alt = `${user.login} image`
            row.querySelector('a').href = `https://github.com/${user.login}`
            row.querySelector('a p').textContent = user.name
            row.querySelector('a span').textContent = '/' + user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('button').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar essa linha?')
                if (isOk){
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })

        this.root.querySelector('#input-search').value = ''
    }

    save(){
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    load(){
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    async add(username){
        try{
            const user = await GithubUser.search(username)

            const userExist = this.entries.find(entry => entry.login ===username)
    
            if (userExist){
                throw new Error('User already exists')
            }

            if(user.login === undefined){
                throw new Error("User doesn't exist")
            }
    
            this.entries = [user, ...this.entries]
    
            this.update()
            this.save()
        } catch(error){
            alert(error.message)
        }

    }

    onadd(){
        const addBtn = this.root.querySelector('.search button')

        window.document.onkeyup = event => {
            if(event.key === "Enter"){ 
              const { value } = this.root.querySelector('#input-search')
              this.add(value)
            }
        }

        addBtn.onclick = () => {
            const { value } = this.root.querySelector('#input-search')
            this.add(value)
        }
        
    }

    delete(user) {
        const filteredEntries = this.entries
          .filter(entry => entry.login !== user.login)
    
        this.entries = filteredEntries
        this.update()
        this.save()
    }

}