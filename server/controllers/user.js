const db = require('../config/conexion');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const saltRounds = 10;

// Función para generar contraseña aleatoria
const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'practicaenvio@gmail.com',
        pass: 'ndju lpfo wyiz hwvw'
    }
});

// Función para enviar correo
const sendWelcomeEmail = async (userData, password) => {
    const mailOptions = {
        from: 'practicaenvio@gmail.com', // Usar el mismo correo configurado en el transporter
        to: userData.correo,
        subject: 'Bienvenido a Solo Electricos - Tus credenciales de acceso',
        html: `
            <h1>Bienvenido a Solo Electricos</h1>
            <p>Hola ${userData.nombres},</p>
            <p>Tu cuenta ha sido creada exitosamente. Aquí están tus credenciales de acceso:</p>
            <p><strong>Correo:</strong> ${userData.correo}</p>
            <p><strong>Contraseña:</strong> ${password}</p>
            <p>Te recomendamos cambiar tu contraseña después de iniciar sesión por primera vez.</p>
            <p>Saludos cordiales,<br>Equipo de Solo Electricos</p>
        `
    };

    return transporter.sendMail(mailOptions);
};

// Función para insertar usuario en la base de datos
const insertUserDB = (userData, hashedPassword) => {
    return new Promise((resolve, reject) => {
        db.query(
            "INSERT INTO usuario(Nombres, Apellidos, Correo, Contrasena, Telefono, Direccion, Genero, Rol) VALUES (?,?,?,?,?,?,?,?)",
            [userData.nombres, userData.apellidos, userData.correo, hashedPassword, 
             userData.telefono, userData.direccion, userData.genero, userData.rol],
            (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            }
        );
    });
};

const createUser = async (req, res) => {
    try {
        const userData = {
            nombres: req.body.Nombres,
            apellidos: req.body.Apellidos,
            correo: req.body.Correo,
            telefono: req.body.Telefono,
            direccion: req.body.Direccion,
            genero: req.body.Genero,
            rol: req.body.Rol
        };

        // Generar contraseña aleatoria
        const generatedPassword = generatePassword();

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(generatedPassword, saltRounds);

        // Insertar usuario en la base de datos
        await insertUserDB(userData, hashedPassword);

        // Enviar correo con las credenciales
        await sendWelcomeEmail(userData, generatedPassword);

        res.status(200).json({
            success: true,
            message: "Usuario registrado exitosamente y correo enviado"
        });

    } catch (error) {
        console.error('Error en createUser:', error);
        
        // Determinar el tipo de error para dar una respuesta más específica
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: "El correo electrónico ya está registrado"
            });
        }

        res.status(500).json({
            success: false,
            message: "Error en el registro de usuario",
            error: error.message
        });
    }
};

const getUser = (req, res) => {
    const id = req.body.ID;

    db.query("SELECT*FROM usuario WHERE Estado = 'Activo' AND Id = ?", [id], (err, results) => {

        if (err) {

            console.log(err);

        } else {

            res.send(results);
            console.log(results);

        }
    });
};

const getUsers = (req, res) => {

    db.query("SELECT*FROM usuario WHERE Estado = 'Activo'", (err, results) => {

        if (err) {

            console.log(err);

        } else {

            res.send(results);
            console.log(results);

        }
    });
};

const getUsersI = (req, res) => {

    db.query("SELECT*FROM usuario WHERE Estado = 'Inactivo'", (err, results) => {

        if (err) {

            console.log(err);

        } else {

            res.send(results);
            console.log(results);

        }
    });
};

const updatePassword = async (req, res) => {
    console.log("Datos recibidos:", req.body);

    const id = req.body.ID;
    const contrasena = req.body.Contrasena;

    if (!id || !contrasena) {
        // Verifica que ambos datos estén presentes
        return res.status(400).send("Faltan datos: ID o Contrasena");
    }

    try {
        // Generar el hash de la contraseña con bcrypt
        const saltRounds = 10; // Define el número de rondas para bcrypt (puedes ajustarlo)
        const contrasenaHash = await bcrypt.hash(contrasena, saltRounds);

        const query = `UPDATE usuario SET Contrasena = ?, Usoc = 'Usada' WHERE ID = ?`;

        // Ejecutar la consulta con la contraseña cifrada
        db.query(query, [contrasenaHash, id], (err, results) => {
            if (err) {
                console.error("Error en la actualización:", err);
                return res.status(500).send("Error al actualizar el usuario");
            }

            if (results.affectedRows === 0) {
                return res.status(404).send("Usuario no encontrado");
            }

            res.send("Usuario actualizado con éxito");
            console.log("Resultado de la actualización:", results);
        });
    } catch (error) {
        console.error("Error al cifrar la contraseña:", error);
        res.status(500).send("Error interno al actualizar la contraseña");
    }
};



const validationUser = async (req, res) => {
    const correo = req.body.Correo;
    const contrasena = req.body.Contrasena;

    console.log('Intento de inicio de sesión para:', correo);

    try {
        const query = "SELECT * FROM usuario WHERE Correo = ? AND Estado = 'Activo'";
        db.query(query, [correo], async (err, results) => {
            if (err) {
                console.error('Error en la consulta:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error al acceder a la base de datos.'
                });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no encontrado o inactivo.'
                });
            }

            const usuario = results[0];

            try {
                const contrasenasCoinciden = await bcrypt.compare(contrasena, usuario.Contrasena);

                if (contrasenasCoinciden) {
                    const usuarioSinContrasena = { ...usuario };
                    delete usuarioSinContrasena.Contrasena;

                    return res.status(200).json({
                        success: true,
                        message: 'Inicio de sesión exitoso.',
                        usuario: usuarioSinContrasena
                    });
                } else {
                    return res.status(401).json({
                        success: false,
                        message: 'Contraseña incorrecta.'
                    });
                }
            } catch (bcryptError) {
                console.error('Error al comparar contraseñas:', bcryptError);
                return res.status(500).json({
                    success: false,
                    message: 'Error al verificar las credenciales.'
                });
            }
        });
    } catch (error) {
        console.error('Error en validationUser:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor.'
        });
    }
};



const updateUser = (req, res) => {
    const id = req.body.ID;
    const nombres = req.body.Nombres;
    const apellidos = req.body.Apellidos;
    const correo = req.body.Correo;
    const contrasena = req.body.Contrasena;
    const telefono = req.body.Telefono;
    const direccion = req.body.Direccion;
    const genero = req.body.Genero;
    const rol = req.body.Rol;
    const estado = req.body.Estado;

    const query = `
        UPDATE usuario 
        SET Nombres = ?, Apellidos = ?, Correo = ?, Contrasena = ?, Telefono = ?, Direccion = ?, Genero = ?, Rol = ?, Estado = ?
        WHERE ID = ?`;

    // Ejecutar la consulta SQL para actualizar el usuario
    db.query(query, [nombres, apellidos, correo, contrasena, telefono, direccion, genero, rol, estado, id], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error al actualizar el usuario');
        } else {
            res.send('Usuario actualizado con éxito');
        }
    });
};
const desactivateUser = (req, res) => {
    const userId = req.params.id;

    const query = `
        UPDATE usuario 
        SET Estado = 'Inactivo' 
        WHERE ID = ?`;

        db.query(query, [userId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al actualizar el estado del usuario');
        } else {
            res.send('Usuario marcado como inactivo');
        }
    });
};


module.exports = {

    createUser,
    updateUser,
    updatePassword,
    getUser,
    getUsers,
    getUsersI,
    validationUser,
    desactivateUser
}