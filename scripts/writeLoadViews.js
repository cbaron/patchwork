#!/usr/bin/env node

Object.create( Object.assign( require('../lib/MyObject').prototype, {
    
    FS: require('fs'),

    constructor( dir ) {
        const excludedFiles = [ 'Footer.js', 'Login.js', 'Header.js', 'AdminHeader.js' ]

        this.P( this.FS.readdir, [ `${dir}/views` ] )
        .then( ( [ files ] ) =>
            this.P(
                this.FS.writeFile,
                [
                    `${dir}/.ViewMap.js`,
                    `module.exports={\n\t` +
                    files.filter( name => !/^[\._]/.test(name) && /\.js/.test(name) && excludedFiles.indexOf( name ) === -1 )
                         .map( name => {
                             name = name.replace('.js','')
                             return `${name}: require('./views/${name}')`
                         } )
                         .join(',\n\t') +
                    `\n}`
                ]
            )
        )
        .then( () =>
           this.P( this.FS.readdir, [ `${dir}/templates` ] )
            .then( ( [ files ] ) => 
                this.P(
                    this.FS.writeFile,
                    [
                        `${dir}/.TemplateMap.js`,
                        `module.exports={\n\t` +
                        files.filter( name => !/^[\._]/.test(name) && /\.js/.test(name) )
                             .map( name => {
                                 name = name.replace('.js','')
                                 return `${name}: require('./templates/${name}')`
                             } )
                             .join(',\n\t') +
                        `\n}`
                    ]
                )
            )
        )
        .catch( this.Error )
    }

} ) ).constructor( `${__dirname}/../client/js` )
