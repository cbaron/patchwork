#!/usr/bin/env node

Object.create( Object.assign( require('../lib/MyObject').prototype, {
    
    FS: require('fs'),

    constructor( dir ) {

        this.P( this.FS.readdir, [ `${dir}/views` ] )
        .then( ( [ files ] ) =>
            this.P(
                this.FS.writeFile,
                [
                    `${dir}/.ViewMap.js`,
                    `module.exports={\n\t` +
                    files.filter( name => !/^[\._]/.test(name) && /\.js/.test(name) )
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
           this.P( this.FS.readdir, [ `${dir}/views/templates` ] )
            .then( ( [ files ] ) => 
                this.P(
                    this.FS.writeFile,
                    [
                        `${dir}/.TemplateMap.js`,
                        `module.exports={\n\t` +
                        files.filter( name => !/^[\._]/.test(name) && /\.js/.test(name) )
                             .map( name => {
                                 name = name.replace('.js','')
                                 return `${name}: require('./views/templates/${name}')`
                             } )
                             .join(',\n\t') +
                        `\n}`
                    ]
                )
            )
        )
        .then( () =>
           this.P( this.FS.readdir, [ `${dir}/views/templates/lib` ] )
            .then( ( [ files ] ) => 
                this.P(
                    this.FS.writeFile,
                    [
                        `${dir}/.IconMap.js`,
                        `module.exports={\n\t` +
                        files.filter( name => !/^[\._]/.test(name) && /\.js/.test(name) )
                             .map( name => {
                                 name = name.replace('.js','')
                                 return `"${name}": require('./views/templates/lib/${name}')`
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
