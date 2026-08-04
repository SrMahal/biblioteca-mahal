<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Biblioteca Mahal</title>
    
    <link rel="shortcut icon" href="/assets/img/logos/logo-biblioteca.png" type="image/x-icon">
    <link rel="stylesheet" href="/assets/css/main.css">

    <!-- Fonte Popins -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap">

    <!-- Libs icones -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <script src="/assets/js/auth.js"></script>
    <script src="/assets/js/sidebar.js"></script>



</head>

<body>

    <div class="center-screen">

        <div class="sidebar-overlay" id="sidebarOverlay"></div>

        <?php include 'assets/pag/home/assets/css/sectiontopbar/topbar-login.php'; ?>

        <div class="app-container">
            <?php include 'assets/pag/home/assets/css/sectionsidebar/sidebar.php'; ?>

            <main class="main-content">


                <?php include 'assets/pag/home/assets/css/section/hero-main.php'; ?>

                <?php include 'assets/pag/home/assets/css/section/apps.php'; ?>

                <?php include 'assets/pag/home/assets/css/section/news-section.php'; ?>

                <?php include 'assets/pag/home/assets/css/section/hero-community.php'; ?>

                <?php include 'assets/pag/home/assets/css/section/marketing.php'; ?>

                <?php include 'assets/pag/home/assets/css/section/footer.php'; ?>



                <footer class="footer">
                    <p>&copy; <?= date('Y') ?> Studio Mahal - Todos os direitos reservados.</p>
                </footer>
            </main>
        </div>


    </div>

    <script type="module" src="assets/pag/home/scripts/hero-three.js"></script>
    <script type="module" src="assets/pag/home/scripts/community-three.js"></script>
    <script type="module" src="assets/pag/home/scripts/apps.js"></script>

</body>

</html>