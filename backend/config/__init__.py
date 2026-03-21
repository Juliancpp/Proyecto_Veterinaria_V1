try:
    import pymysql
    pymysql.install_as_MySQLdb()
except ImportError:
    # PyMySQL is only needed when using MySQL/MariaDB.
    # When using SQLite (the default), this import is safely skipped.
    pass
