const { data, error } = await supabase.from('user_data').select('*').eq('user_id', currentUser.id).maybeSingle();
if (error) console.error('Erro ao carregar:', error);
if (data) { 
    // carrega dados...
} else {
    // Inicializa arrays vazios se for utilizador novo
    tasks = []; routines = []; reminders = [];
}