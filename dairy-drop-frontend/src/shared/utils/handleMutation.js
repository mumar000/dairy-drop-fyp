export async function handleMutation(mutationFn, args, successMessage) {
  try {
    const result = await mutationFn(args).unwrap()
    if (successMessage) console.log(successMessage)
    return result
  } catch (e) {
    const msg = e?.data?.message || e?.error || 'Request failed'
    console.error(msg)
    alert(msg)
    throw e
  }
}

