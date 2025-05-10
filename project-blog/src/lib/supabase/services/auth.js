/**
 * Authentication Service
 * 
 * Este servicio integra Firebase Authentication con Supabase.
 * Maneja la autenticación de usuarios y sincroniza los datos de usuarios entre Firebase y Supabase.
 */

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import supabase from '../config/supabase';

/**
 * Sincroniza el usuario de Firebase con Supabase
 * @param {Object} firebaseUser - El objeto de usuario de Firebase
 * @returns {Promise} - Promesa que resuelve al perfil de usuario sincronizado
 */
export const syncUserWithSupabase = async (firebaseUser) => {
  if (!firebaseUser) {
    console.log('No Firebase user provided, skipping sync');
    return null;
  }

  console.log('Syncing Firebase user with Supabase:', {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName
  });

  try {
    // Verificar si el usuario existe en Supabase
    const { data: existingUser, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('firebase_uid', firebaseUser.uid)
      .maybeSingle(); // Usar maybeSingle en lugar de single para evitar errores

    if (fetchError) {
      console.error('Error checking for existing user:', fetchError);
      // Continuar la ejecución en lugar de lanzar, para intentar la creación del perfil
    }

    console.log('Existing user check result:', { existingUser, fetchError });

    // Si el usuario no existe, crear un nuevo perfil
    if (!existingUser) {
      console.log('User does not exist in Supabase, creating profile...');
      
      // Usar el método auth.getUser() de Supabase para obtener el token JWT
      const { data: authData } = await supabase.auth.getUser();
      console.log('Auth data:', authData);
      
      // Preparar los datos del nuevo perfil
      const newProfile = {
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email,
        display_name: firebaseUser.displayName || '',
        avatar_url: firebaseUser.photoURL || '',
        role: 'user', // Rol predeterminado
        created_at: new Date().toISOString()
      };

      // Insertar el nuevo perfil en Supabase
      const { data: createdProfile, error: insertError } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user profile in Supabase:', insertError);
        throw insertError;
      }

      console.log('Successfully created user profile in Supabase:', createdProfile);
      return createdProfile;
    }

    // Si el usuario ya existe, actualizar los campos que podrían haber cambiado
    console.log('User exists in Supabase, updating profile...');
    
    const updatedProfile = {
      display_name: firebaseUser.displayName || existingUser.display_name,
      avatar_url: firebaseUser.photoURL || existingUser.avatar_url,
      last_sign_in: new Date().toISOString()
    };

    const { data: updatedData, error: updateError } = await supabase
      .from('profiles')
      .update(updatedProfile)
      .eq('firebase_uid', firebaseUser.uid)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating user profile in Supabase:', updateError);
      throw updateError;
    }

    console.log('Successfully updated user profile in Supabase:', updatedData);
    return updatedData;
  } catch (error) {
    console.error('Error in syncUserWithSupabase:', error);
    throw error;
  }
};

/**
 * Configura un listener para los cambios de estado de autenticación de Firebase
 * y sincroniza el usuario con Supabase
 * @returns {Function} - Función para cancelar la suscripción al listener
 */
export const setupAuthSync = () => {
  const auth = getAuth();
  
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      console.log('Firebase Auth state changed: User signed in', firebaseUser.uid);
      await syncUserWithSupabase(firebaseUser);
    } else {
      console.log('Firebase Auth state changed: User signed out');
    }
  });
};

/**
 * Obtiene el perfil del usuario actual de Supabase
 * @param {string} firebaseUid - El UID de Firebase del usuario
 * @returns {Promise} - Promesa que resuelve al perfil del usuario
 */
export const getCurrentUserProfile = async (firebaseUid) => {
  if (!firebaseUid) {
    console.error('No Firebase UID provided to getCurrentUserProfile');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('firebase_uid', firebaseUid)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getCurrentUserProfile:', error);
    throw error;
  }
};

/**
 * Actualiza el perfil del usuario en Supabase
 * @param {string} firebaseUid - El UID de Firebase del usuario
 * @param {Object} profileData - Los datos del perfil a actualizar
 * @returns {Promise} - Promesa que resuelve al perfil actualizado
 */
export const updateUserProfile = async (firebaseUid, profileData) => {
  if (!firebaseUid) {
    console.error('No Firebase UID provided to updateUserProfile');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('firebase_uid', firebaseUid)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }

    console.log('Successfully updated user profile:', data);
    return data;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
};

/**
 * Verifica si un usuario tiene privilegios de administrador
 * @param {string} email - La dirección de correo electrónico del usuario
 * @returns {Promise<boolean>} - Promesa que resuelve a si el usuario es administrador
 */
export const checkAdminAccess = async (email) => {
  if (!email) {
    console.error('No email provided to checkAdminAccess');
    return false;
  }

  try {
    // Verificar si el email está en la lista de administradores
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (error) {
      console.error('Error checking admin access:', error);
      return false;
    }

    // Si se encuentra el email en la tabla de administradores, el usuario tiene acceso de administrador
    const isAdmin = !!data;
    console.log(`Admin access check for ${email}: ${isAdmin ? 'Granted' : 'Denied'}`);
    
    // Si el usuario es administrador, actualizar su perfil para reflejar el rol
    if (isAdmin) {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email.toLowerCase())
        .maybeSingle();
      
      if (!profileError && profiles && profiles.role !== 'admin') {
        await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('email', email.toLowerCase());
      }
    }
    
    return isAdmin;
  } catch (error) {
    console.error('Error in checkAdminAccess:', error);
    return false;
  }
};

export default {
  syncUserWithSupabase,
  setupAuthSync,
  getCurrentUserProfile,
  updateUserProfile,
  checkAdminAccess
};
